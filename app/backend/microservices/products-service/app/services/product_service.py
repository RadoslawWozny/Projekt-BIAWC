from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.product_schema import ProductCreate, ProductUpdate


def get_all_products(db: Session):
    """Pobiera wszystkie produkty z bazy"""
    return db.query(Product).all()


def get_product_by_id(db: Session, product_id: int):
    """Pobiera produkt po ID"""
    return db.query(Product).filter(Product.id == product_id).first()


def create_product(db: Session, product_data: ProductCreate):
    """Tworzy nowy produkt w bazie"""
    db_product = Product(**product_data.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


def update_product(db: Session, product_id: int, product_data: ProductUpdate):
    """Aktualizuje istniejący produkt - tylko podane pola"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return None

    update_data = product_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)

    db.commit()
    db.refresh(db_product)
    return db_product


def delete_product(db: Session, product_id: int):
    """Usuwa produkt z bazy po ID"""
    db_product = db.query(Product).filter(Product.id == product_id).first()
    if not db_product:
        return False

    db.delete(db_product)
    db.commit()
    return True
