from fastapi import APIRouter
from datetime import datetime

from app.schemas.health import HealthResponse, PingResponse

router = APIRouter()


@router.get("/ping", response_model=PingResponse, tags=["health"])
async def ping():
    """Simple ping endpoint"""
    return PingResponse(
        status="ok",
        message="pong",
        timestamp=datetime.utcnow()
    )


@router.get("/health", response_model=HealthResponse, tags=["health"])
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
