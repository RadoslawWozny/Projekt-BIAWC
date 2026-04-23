from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Orders Service"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@orders-db:5432/ordersdb"
    
    # Redis
    REDIS_URL: str = "redis://orders-redis:6379/0"
    
    # Message Queue (RabbitMQ/Kafka)
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"
    
    # External services
    USER_SERVICE_URL: str = "http://user-service:8000"
    CART_SERVICE_URL: str = "http://cart-service:8000"
    PRODUCTS_SERVICE_URL: str = "http://products-service:8000"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
