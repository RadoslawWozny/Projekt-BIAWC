from fastapi import APIRouter, HTTPException, status
from app.models.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserConfirmRequest,
    RefreshTokenRequest,
)
from app.services.cognito_service import cognito_service

router = APIRouter()

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(request: UserRegisterRequest):
    try:
        result = cognito_service.register_user(request.email, request.password)
        return {"message": "Rejestracja udana. Sprawdź e-mail w celu potwierdzenia konta.", "user_sub": result.get("UserSub")}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/confirm", status_code=status.HTTP_200_OK)
async def confirm(request: UserConfirmRequest):
    try:
        cognito_service.confirm_registration(request.email, request.code)
        return {"message": "Konto potwierdzone pomyślnie."}
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(request: UserLoginRequest):
    try:
        tokens = cognito_service.authenticate_user(request.email, request.password)
        if not tokens:
            raise Exception("Brak tokenów w odpowiedzi serwera autoryzacyjnego.")
            
        return {
            "message": "Zalogowano pomyślnie",
            "access_token": tokens.get("AccessToken"),
            "id_token": tokens.get("IdToken"),
            "refresh_token": tokens.get("RefreshToken")
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/refresh", status_code=status.HTTP_200_OK)
async def refresh(request: RefreshTokenRequest):
    """Odświeża access_token / id_token przy użyciu refresh_token otrzymanego podczas logowania."""
    try:
        tokens = cognito_service.refresh_tokens(request.refresh_token)
        if not tokens or not tokens.get("AccessToken"):
            raise Exception("Brak tokenów w odpowiedzi serwera autoryzacyjnego.")

        return {
            "message": "Token odświeżony pomyślnie",
            "access_token": tokens.get("AccessToken"),
            "id_token": tokens.get("IdToken"),
            "expires_in": tokens.get("ExpiresIn"),
            "token_type": tokens.get("TokenType"),
        }
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))
