from fastapi import APIRouter
from datetime import datetime

from app.models.health import HealthResponse, PingResponse

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
            "user_service": "ok",
            "products_service": "ok"
        }
    )


@protected_router.get("/items", tags=["cart"])
async def get_cart_items():
    """Pobierz zawartość koszyka (wymaga tokena JWT)"""
    return {"items": []}
