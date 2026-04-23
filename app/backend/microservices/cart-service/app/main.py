from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.controllers.routes import public_router, protected_router
from app.core.config import settings
from app.core.security import get_current_user

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Cart Service - zarządzanie koszykiem zakupowym"
)

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
