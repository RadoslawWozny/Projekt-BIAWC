"""
Wspólny moduł wyjątków dla wszystkich mikrousług.

Mountowany w docker-compose do katalogu /app/shared w każdym kontenerze.
Użycie:
    from shared.exceptions import NotFoundError, register_exception_handlers

    register_exception_handlers(app)
    raise NotFoundError("user_id not found", resource="user", identifier=user_id)
"""
from __future__ import annotations

from typing import Any, Optional

from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class AppError(Exception):
    """Bazowy wyjątek aplikacyjny - wszystkie własne błędy dziedziczą po nim."""

    status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code: str = "internal_error"

    def __init__(
        self,
        message: str,
        *,
        resource: Optional[str] = None,
        identifier: Optional[Any] = None,
        details: Optional[dict] = None,
    ) -> None:
        super().__init__(message)
        self.message = message
        self.resource = resource
        self.identifier = identifier
        self.details = details or {}

    def to_dict(self) -> dict:
        payload: dict = {
            "error": self.error_code,
            "message": self.message,
        }
        if self.resource is not None:
            payload["resource"] = self.resource
        if self.identifier is not None:
            payload["identifier"] = self.identifier
        if self.details:
            payload["details"] = self.details
        return payload


class NotFoundError(AppError):
    status_code = status.HTTP_404_NOT_FOUND
    error_code = "not_found"


class ValidationError(AppError):
    status_code = status.HTTP_400_BAD_REQUEST
    error_code = "validation_error"


class ConflictError(AppError):
    status_code = status.HTTP_409_CONFLICT
    error_code = "conflict"


class UnauthorizedError(AppError):
    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "unauthorized"


class ForbiddenError(AppError):
    status_code = status.HTTP_403_FORBIDDEN
    error_code = "forbidden"


class BusinessRuleError(AppError):
    """Naruszenie reguły biznesowej (np. pusty koszyk, brak stanu)."""

    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    error_code = "business_rule_violation"


class ExternalServiceError(AppError):
    status_code = status.HTTP_502_BAD_GATEWAY
    error_code = "external_service_error"


# ---------- Handlery ---------------------------------------------------------

async def _app_error_handler(_: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(status_code=exc.status_code, content=exc.to_dict())


async def _http_exception_handler(_: Request, exc: StarletteHTTPException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": "http_error", "message": exc.detail},
    )


async def _validation_exception_handler(
    _: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "validation_error",
            "message": "Błąd walidacji danych wejściowych",
            "details": exc.errors(),
        },
    )


async def _unhandled_exception_handler(_: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": "internal_error", "message": str(exc) or "Wewnętrzny błąd serwera"},
    )


def register_exception_handlers(app: FastAPI) -> None:
    """Rejestruje spójne handlery wyjątków dla danej aplikacji FastAPI."""
    app.add_exception_handler(AppError, _app_error_handler)
    app.add_exception_handler(StarletteHTTPException, _http_exception_handler)
    app.add_exception_handler(RequestValidationError, _validation_exception_handler)
    app.add_exception_handler(Exception, _unhandled_exception_handler)


__all__ = [
    "AppError",
    "NotFoundError",
    "ValidationError",
    "ConflictError",
    "UnauthorizedError",
    "ForbiddenError",
    "BusinessRuleError",
    "ExternalServiceError",
    "register_exception_handlers",
]
