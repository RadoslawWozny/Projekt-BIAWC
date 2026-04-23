import sys
from pathlib import Path

# Umożliwia import `shared.*` zarówno w Dockerze (/app/shared) jak i lokalnie
_here = Path(__file__).resolve()
for _p in [Path("/app"), *_here.parents]:
    if (_p / "shared" / "exceptions.py").exists():
        if str(_p) not in sys.path:
            sys.path.insert(0, str(_p))
        break

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.controllers.routes import public_router, protected_router
from app.core.config import settings
from app.core.security import get_current_user
from shared.exceptions import register_exception_handlers


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Wykonuje się przy starcie aplikacji - tworzy tabele w bazie"""
    try:
        from app.database.database import engine, Base
        from app.models.cart import Cart, CartItem  # noqa: F401
        Base.metadata.create_all(bind=engine)
        print("Tabele cart i cart_items zostały utworzone/zweryfikowane.")
    except Exception as e:
        print(f"Ostrzeżenie: Nie udało się połączyć z bazą danych: {e}")
    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Cart Service - zarządzanie koszykiem zakupowym",
    lifespan=lifespan
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
