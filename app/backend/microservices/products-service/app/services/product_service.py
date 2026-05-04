from sqlalchemy.orm import Session
from sqlalchemy import distinct, func
from typing import Optional, List
from app.models.product import Product
from app.models.product_schema import ProductCreate, ProductUpdate


def search_products_by_description(db: Session, query: str, limit: int = 5):
    """Wyszukuje produkty po frazie w opisie (case-insensitive), zwraca losowe `limit` wyników"""
    return (
        db.query(Product)
        .filter(Product.opis.ilike(f"%{query}%"))
        .order_by(func.random())
        .limit(limit)
        .all()
    )


def get_all_products(db: Session):
    """Pobiera wszystkie produkty z bazy"""
    return db.query(Product).all()


def get_product_by_id(db: Session, product_id: int):
    """Pobiera produkt po ID"""
    return db.query(Product).filter(Product.id == product_id).first()


def get_products_by_category(db: Session, kategoria: str):
    """Pobiera produkty o danej kategorii (case-insensitive)"""
    return db.query(Product).filter(
        func.lower(Product.kategoria) == kategoria.lower()
    ).all()


def get_products_by_subcategory(db: Session, podkategoria: str):
    """Pobiera produkty o danej podkategorii (case-insensitive)"""
    return db.query(Product).filter(
        func.lower(Product.podkategoria) == podkategoria.lower()
    ).all()


def get_products_filtered(
    db: Session,
    kategoria: Optional[str] = None,
    podkategoria: Optional[str] = None,
    min_cena: Optional[float] = None,
    max_cena: Optional[float] = None,
    dostepnosc: Optional[bool] = None,
    kraj_pochodzenia: Optional[str] = None,
    sort_by: Optional[str] = None,
    sort_order: str = "asc",
):
    """Pobiera produkty z opcjonalnymi filtrami i sortowaniem"""
    query = db.query(Product)

    if kategoria:
        query = query.filter(func.lower(Product.kategoria) == kategoria.lower())
    if podkategoria:
        query = query.filter(func.lower(Product.podkategoria) == podkategoria.lower())
    if min_cena is not None:
        query = query.filter(Product.cena >= min_cena)
    if max_cena is not None:
        query = query.filter(Product.cena <= max_cena)
    if dostepnosc is not None:
        query = query.filter(Product.dostepnosc == dostepnosc)
    if kraj_pochodzenia:
        query = query.filter(func.lower(Product.kraj_pochodzenia) == kraj_pochodzenia.lower())

    # Sortowanie
    if sort_by:
        column = getattr(Product, sort_by, None)
        if column is not None:
            query = query.order_by(column.desc() if sort_order == "desc" else column.asc())

    return query.all()


def get_all_categories(db: Session) -> List[str]:
    """Pobiera listę unikalnych kategorii z bazy"""
    results = db.query(distinct(Product.kategoria)).filter(
        Product.kategoria.isnot(None)
    ).all()
    return [r[0] for r in results]


def get_all_subcategories(db: Session, kategoria: Optional[str] = None) -> List[str]:
    """Pobiera listę unikalnych podkategorii, opcjonalnie filtrując po kategorii"""
    query = db.query(distinct(Product.podkategoria)).filter(
        Product.podkategoria.isnot(None)
    )
    if kategoria:
        query = query.filter(func.lower(Product.kategoria) == kategoria.lower())
    results = query.all()
    return [r[0] for r in results]


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
