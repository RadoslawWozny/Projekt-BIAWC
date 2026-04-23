from sqlalchemy.orm import Session
from sqlalchemy import text

from app.models.cart import Cart, CartItem
from app.models.cart_schema import CartCreate, CartItemCreate, CartItemUpdate
from shared.exceptions import (
    NotFoundError,
    ValidationError,
    ConflictError,
    BusinessRuleError,
)


def _user_exists(db: Session, user_id: int) -> bool:
    row = db.execute(
        text("SELECT 1 FROM users WHERE id = :uid LIMIT 1"),
        {"uid": user_id},
    ).first()
    return row is not None


def _get_product(db: Session, product_id: int):
    return db.execute(
        text("SELECT id, ilosc, dostepnosc FROM products WHERE id = :pid"),
        {"pid": product_id},
    ).first()


def create_cart(db: Session, cart_data: CartCreate):
    if not _user_exists(db, cart_data.user_id):
        raise NotFoundError(
            "user_id not found",
            resource="user",
            identifier=cart_data.user_id,
        )

    if cart_data.aktywny:
        existing = (
            db.query(Cart)
            .filter(Cart.user_id == cart_data.user_id, Cart.aktywny.is_(True))
            .first()
        )
        if existing:
            raise ConflictError(
                "Active cart already exists for user",
                resource="cart",
                identifier=existing.id,
            )

    db_cart = Cart(user_id=cart_data.user_id, aktywny=cart_data.aktywny)
    db.add(db_cart)
    db.commit()
    db.refresh(db_cart)
    return db_cart


def get_cart(db: Session, cart_id: int):
    cart = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart:
        raise NotFoundError(
            "cart_id not found",
            resource="cart",
            identifier=cart_id,
        )
    return cart


def get_user_cart_items(db: Session, user_id: int):
    if not _user_exists(db, user_id):
        raise NotFoundError(
            "user_id not found",
            resource="user",
            identifier=user_id,
        )

    cart = (
        db.query(Cart)
        .filter(Cart.user_id == user_id, Cart.aktywny.is_(True))
        .first()
    )
    if not cart:
        raise NotFoundError(
            "Active cart not found for user",
            resource="cart",
            identifier=user_id,
        )
    return cart.items


def get_product_from_db(db: Session, product_id: int):
    query = text("SELECT * FROM products WHERE id = :id")
    result = db.execute(query, {"id": product_id}).fetchone()
    if not result:
        raise NotFoundError(
            "product_id not found",
            resource="product",
            identifier=product_id,
        )
    return dict(result._mapping)


def delete_cart(db: Session, cart_id: int):
    db_cart = get_cart(db, cart_id)
    db.delete(db_cart)
    db.commit()
    return True


def add_cart_item(db: Session, cart_id: int, item_data: CartItemCreate):
    # cart_id już zweryfikowane w route przez get_cart
    if item_data.ilosc is None or item_data.ilosc <= 0:
        raise ValidationError(
            "ilosc must be a positive integer",
            details={"received": item_data.ilosc},
        )

    product = _get_product(db, item_data.product_id)
    if product is None:
        raise NotFoundError(
            "product_id not found",
            resource="product",
            identifier=item_data.product_id,
        )
    _, stan, dostepnosc = product
    if not dostepnosc:
        raise BusinessRuleError(
            "Product is not available",
            resource="product",
            identifier=item_data.product_id,
        )
    if stan is not None and stan < item_data.ilosc:
        raise BusinessRuleError(
            "Insufficient stock for product",
            resource="product",
            identifier=item_data.product_id,
            details={"requested": item_data.ilosc, "available": stan},
        )

    db_item = CartItem(
        cart_id=cart_id,
        product_id=item_data.product_id,
        ilosc=item_data.ilosc,
    )
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_cart_item(db: Session, item_id: int, item_data: CartItemUpdate):
    db_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not db_item:
        raise NotFoundError(
            "cart_item_id not found",
            resource="cart_item",
            identifier=item_id,
        )

    update_data = item_data.model_dump(exclude_unset=True)
    if "ilosc" in update_data and update_data["ilosc"] is not None and update_data["ilosc"] <= 0:
        raise ValidationError(
            "ilosc must be a positive integer",
            details={"received": update_data["ilosc"]},
        )

    for key, value in update_data.items():
        setattr(db_item, key, value)

    db.commit()
    db.refresh(db_item)
    return db_item


def delete_cart_item(db: Session, item_id: int):
    db_item = db.query(CartItem).filter(CartItem.id == item_id).first()
    if not db_item:
        raise NotFoundError(
            "cart_item_id not found",
            resource="cart_item",
            identifier=item_id,
        )
    db.delete(db_item)
    db.commit()
    return True
