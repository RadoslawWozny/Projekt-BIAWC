import sys
from pathlib import Path

# Umożliwia import `shared.*` zarówno w Dockerze (/app/shared) jak i lokalnie
# (microservices/shared obok katalogu orders-service).
_here = Path(__file__).resolve()
_candidates = [Path("/app"), *_here.parents]
for _p in _candidates:
    if (_p / "shared" / "exceptions.py").exists():
        if str(_p) not in sys.path:
            sys.path.insert(0, str(_p))
        break

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.routes import public_router, protected_router
from app.core.config import settings
from app.core.security import get_current_user
from shared.exceptions import register_exception_handlers

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Orders Service - zarządzanie zamówieniami i płatnościami"
)

register_exception_handlers(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Router publiczny (health/ping) - BEZ autoryzacji
app.include_router(public_router, prefix=settings.API_PREFIX)

# Router chroniony - WYMAGA tokena JWT z Cognito przy KAŻDYM requeście
app.include_router(protected_router, prefix=settings.API_PREFIX, dependencies=[Depends(get_current_user)])

@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.PROJECT_NAME}", "version": settings.VERSION}
