from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.models.health import HealthResponse, PingResponse
from app.models.cart_schema import (
    CartCreate, CartResponse, CartItemCreate, CartItemUpdate, CartItemResponse
)
from app.database.database import get_db
from app.services import cart_service

# Router publiczny - health check (bez autoryzacji)
public_router = APIRouter()

# Router chroniony - endpointy biznesowe (autoryzacja na poziomie main.py)
protected_router = APIRouter()


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
        service="cart-service",
        version="1.0.0",
        timestamp=datetime.utcnow(),
        checks={
            "redis": "ok",
            "database": "ok"
        }
    )

# ==================== CART ENDPOINTS ====================

@protected_router.post("/cart", response_model=CartResponse, status_code=status.HTTP_201_CREATED, tags=["cart"])
def create_cart(cart_data: CartCreate, db: Session = Depends(get_db)):
    """Tworzy nowy koszyk dla użytkownika"""
    return cart_service.create_cart(db, cart_data)


@protected_router.get("/cart/{id}", response_model=CartResponse, tags=["cart"])
def get_cart(id: int, db: Session = Depends(get_db)):
    """Pobiera dane konkretnego koszyka"""
    return cart_service.get_cart(db, id)


@protected_router.delete("/cart/{id}", tags=["cart"])
def delete_cart(id: int, db: Session = Depends(get_db)):
    """Usuwa cały wpis koszyka"""
    cart_service.delete_cart(db, id)
    return {"message": f"Koszyk {id} został usunięty"}


# ==================== CART ITEMS ENDPOINTS ====================

@protected_router.get("/cart/cart_items/{user_id}", response_model=List[CartItemResponse], tags=["cart_items"])
def get_user_cart_items(user_id: int, db: Session = Depends(get_db)):
    """Zwraca wszystkie pozycje z aktywnego koszyka danego użytkownika"""
    return cart_service.get_user_cart_items(db, user_id)


@protected_router.post("/cart/cart_items/{id}", response_model=CartItemResponse, status_code=status.HTTP_201_CREATED, tags=["cart_items"])
def add_cart_item(id: int, item_data: CartItemCreate, db: Session = Depends(get_db)):
    """Dodaje produkt do koszyka o podanym ID"""
    cart_service.get_cart(db, id)  # rzuca NotFoundError jeśli koszyka nie ma
    return cart_service.add_cart_item(db, id, item_data)


@protected_router.put("/cart/cart_items/{id}", response_model=CartItemResponse, tags=["cart_items"])
def update_cart_item(id: int, item_data: CartItemUpdate, db: Session = Depends(get_db)):
    """Aktualizuje pozycję w koszyku (np. ilość)"""
    return cart_service.update_cart_item(db, id, item_data)


@protected_router.delete("/cart/cart_items/{id}", tags=["cart_items"])
def delete_cart_item(id: int, db: Session = Depends(get_db)):
    """Usuwa konkretny produkt z koszyka"""
    cart_service.delete_cart_item(db, id)
    return {"message": f"Pozycja {id} usunięta z koszyka"}


# ==================== CROSS-SERVICE (PRODUCTS) ====================

@protected_router.get("/cart/products/{id}", tags=["cross-service"])
def get_product_info(id: int, db: Session = Depends(get_db)):
    """Zwraca informacje o produkcie z tabeli products (przez wspólną bazę)"""
    return cart_service.get_product_from_db(db, id)
