from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from datetime import datetime
from decimal import Decimal
from typing import List

from app.models.health import HealthResponse, PingResponse
from app.models.order import Order, OrderItem
from app.models.order_schema import (
    OrderCreateRequest,
    OrderStatusUpdateRequest,
    OrderDetailResponse,
    OrderHeaderResponse,
)
from app.database.database import get_db
from shared.exceptions import (
    NotFoundError,
    BusinessRuleError,
    ValidationError,
    AppError,
)

# Router publiczny - health check (bez autoryzacji)
public_router = APIRouter()

# Router chroniony - endpointy biznesowe (autoryzacja na poziomie main.py)
protected_router = APIRouter()


ALLOWED_STATUSES = {"nowe", "opłacone", "wysłane", "zrealizowane", "anulowane"}


def _user_exists(db: Session, user_id: int) -> bool:
    row = db.execute(
        text("SELECT 1 FROM users WHERE id = :uid LIMIT 1"),
        {"uid": user_id},
    ).first()
    return row is not None


@public_router.get("/ping", response_model=PingResponse, tags=["health"])
async def ping():
    """Simple ping endpoint"""
    return PingResponse(
        status="ok",
        message="pong",
        timestamp=datetime.utcnow()
    )


@public_router.get("/health", response_model=HealthResponse, tags=["health"])
async def health_check():
    """Health check endpoint with service status"""
    return HealthResponse(
        status="healthy",
        service="orders-service",
        version="1.0.0",
        timestamp=datetime.utcnow(),
        checks={
            "database": "ok",
            "redis": "ok",
            "rabbitmq": "ok",
            "user_service": "ok",
            "cart_service": "ok",
            "products_service": "ok"
        }
    )


@protected_router.post(
    "/orders",
    response_model=OrderDetailResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["orders"],
)
def create_order(payload: OrderCreateRequest, db: Session = Depends(get_db)):
    """Złożenie zamówienia na podstawie aktywnego koszyka użytkownika."""
    try:
        if not _user_exists(db, payload.user_id):
            raise NotFoundError(
                "user_id not found",
                resource="user",
                identifier=payload.user_id,
            )

        cart_row = db.execute(
            text(
                "SELECT id FROM cart "
                "WHERE user_id = :uid AND aktywny = TRUE "
                "ORDER BY id DESC LIMIT 1 FOR UPDATE"
            ),
            {"uid": payload.user_id},
        ).first()
        if not cart_row:
            raise NotFoundError(
                "Active cart not found for user",
                resource="cart",
                identifier=payload.user_id,
            )
        cart_id = cart_row[0]

        cart_items = db.execute(
            text("SELECT product_id, ilosc FROM cart_items WHERE cart_id = :cid"),
            {"cid": cart_id},
        ).fetchall()
        if not cart_items:
            raise BusinessRuleError(
                "Cart is empty",
                resource="cart",
                identifier=cart_id,
            )

        product_ids = [row[0] for row in cart_items]
        products = db.execute(
            text(
                "SELECT id, cena, ilosc, dostepnosc FROM products "
                "WHERE id = ANY(:ids) FOR UPDATE"
            ),
            {"ids": product_ids},
        ).fetchall()
        product_map = {p[0]: p for p in products}

        order = Order(user_id=payload.user_id, status="nowe", laczna_kwota=Decimal("0"))
        db.add(order)
        db.flush()

        total = Decimal("0")
        new_items: List[OrderItem] = []
        for product_id, ilosc in cart_items:
            prod = product_map.get(product_id)
            if prod is None:
                raise NotFoundError(
                    "product_id not found",
                    resource="product",
                    identifier=product_id,
                )
            _, cena, stan, dostepnosc = prod
            if not dostepnosc:
                raise BusinessRuleError(
                    "Product is not available",
                    resource="product",
                    identifier=product_id,
                )
            if stan is not None and stan < ilosc:
                raise BusinessRuleError(
                    "Insufficient stock for product",
                    resource="product",
                    identifier=product_id,
                    details={"requested": ilosc, "available": stan},
                )
            cena_dec = Decimal(str(cena))
            total += cena_dec * ilosc
            new_items.append(
                OrderItem(
                    order_id=order.id,
                    product_id=product_id,
                    ilosc=ilosc,
                    cena_w_momencie_zakupu=cena_dec,
                )
            )

        db.add_all(new_items)
        order.laczna_kwota = total

        db.execute(
            text("DELETE FROM cart_items WHERE cart_id = :cid"),
            {"cid": cart_id},
        )

        db.commit()
        db.refresh(order)
        return order
    except AppError:
        db.rollback()
        raise
    except Exception as exc:
        db.rollback()
        raise AppError(f"Order creation failed: {exc}")


@protected_router.get(
    "/orders/user/{user_id}",
    response_model=List[OrderHeaderResponse],
    tags=["orders"],
)
def get_user_orders(user_id: int, db: Session = Depends(get_db)):
    """Historia zamówień danego użytkownika (nagłówki)."""
    if not _user_exists(db, user_id):
        raise NotFoundError(
            "user_id not found",
            resource="user",
            identifier=user_id,
        )

    orders = (
        db.query(Order)
        .filter(Order.user_id == user_id)
        .order_by(Order.data_zamowienia.desc())
        .all()
    )
    if not orders:
        raise NotFoundError(
            "No orders found for user",
            resource="orders",
            identifier=user_id,
        )
    return orders


@protected_router.get(
    "/orders/{order_id}",
    response_model=OrderDetailResponse,
    tags=["orders"],
)
def get_order(order_id: int, db: Session = Depends(get_db)):
    """Szczegóły zamówienia wraz z pozycjami."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise NotFoundError(
            "order_id not found",
            resource="order",
            identifier=order_id,
        )
    return order


@protected_router.put(
    "/orders/{order_id}/status",
    response_model=OrderHeaderResponse,
    tags=["orders"],
)
def update_order_status(
    order_id: int,
    payload: OrderStatusUpdateRequest,
    db: Session = Depends(get_db),
):
    """Aktualizacja statusu zamówienia."""
    if payload.status not in ALLOWED_STATUSES:
        raise ValidationError(
            "Invalid status value",
            details={"allowed": sorted(ALLOWED_STATUSES), "received": payload.status},
        )

    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise NotFoundError(
            "order_id not found",
            resource="order",
            identifier=order_id,
        )

    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order
