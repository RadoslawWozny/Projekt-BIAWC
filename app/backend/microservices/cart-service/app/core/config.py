from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Cart Service"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Redis (primary storage for cart)
    REDIS_URL: str = "redis://cart-redis:6379/0"
    
    # External services
    USER_SERVICE_URL: str = "http://user-service:8000"
    PRODUCTS_SERVICE_URL: str = "http://products-service:8000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
