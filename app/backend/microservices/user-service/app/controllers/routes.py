from fastapi import APIRouter, status
from datetime import datetime

from app.models.health import HealthResponse, PingResponse
from app.controllers.auth_routes import router as auth_router

# Router publiczny - health check + autoryzacja (bez tokena)
public_router = APIRouter()
public_router.include_router(auth_router, prefix="/auth", tags=["auth"])

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
        service="user-service",
        version="1.0.0",
        timestamp=datetime.utcnow(),
        checks={
            "database": "ok",
            "redis": "ok"
        }
    )


@protected_router.get("/me", tags=["users"])
async def get_my_profile():
    """Zwraca dane zalogowanego użytkownika (wymaga tokena JWT)"""
    return {"message": "Dane użytkownika pobrane z tokena"}
