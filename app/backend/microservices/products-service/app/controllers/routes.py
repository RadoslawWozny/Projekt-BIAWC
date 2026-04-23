from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.models.health import HealthResponse, PingResponse
from app.models.product_schema import ProductCreate, ProductUpdate, ProductResponse
from app.database.database import get_db
from app.services import product_service

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
        service="products-service",
        version="1.0.0",
        timestamp=datetime.utcnow(),
        checks={
            "database": "ok",
            "redis": "ok",
            "elasticsearch": "ok"
        }
    )


# ==================== CRUD PRODUCTS ====================

@public_router.get("/products", response_model=List[ProductResponse], tags=["products"])
def get_all_products(db: Session = Depends(get_db)):
    """Zwraca wszystkie produkty z bazy danych"""
    return product_service.get_all_products(db)


@public_router.get("/products/{product_id}", response_model=ProductResponse, tags=["products"])
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Zwraca produkt o konkretnym ID"""
    product = product_service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produkt o id {product_id} nie został znaleziony"
        )
    return product


@protected_router.post("/products", response_model=ProductResponse, status_code=status.HTTP_201_CREATED, tags=["products"])
def create_product(product_data: ProductCreate, db: Session = Depends(get_db)):
    """Dodaje nowy produkt do bazy danych"""
    return product_service.create_product(db, product_data)


@protected_router.put("/products/{product_id}", response_model=ProductResponse, tags=["products"])
def update_product(product_id: int, product_data: ProductUpdate, db: Session = Depends(get_db)):
    """Aktualizuje produkt o podanym ID - zmienia tylko przesłane pola"""
    product = product_service.update_product(db, product_id, product_data)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produkt o id {product_id} nie został znaleziony"
        )
    return product


@protected_router.delete("/products/{product_id}", status_code=status.HTTP_200_OK, tags=["products"])
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Usuwa produkt o podanym ID z bazy danych"""
    deleted = product_service.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Produkt o id {product_id} nie został znaleziony"
        )
    return {"message": f"Produkt o id {product_id} został usunięty"}
