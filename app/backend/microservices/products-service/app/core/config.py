from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Products Service"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api/v1"
    
    # CORS
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # Database
    DATABASE_URL: str = "postgresql://user:password@products-db:5432/productsdb"
    
    # Redis
    REDIS_URL: str = "redis://products-redis:6379/0"
    
    # Elasticsearch
    ELASTICSEARCH_URL: str = "http://elasticsearch:9200"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
