from pydantic_settings import BaseSettings, SettingsConfigDict

class DatabaseSettings(BaseSettings):
    # Wymagamy, aby zmienna DATABASE_URL była dostarczona (np. z pliku .env)
    DATABASE_URL: str

    # Konfiguracja Pydantic dla wczytywania pliku .env
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore" # Ignorujemy inne zmienne środowiskowe, których tu nie zdefiniowaliśmy
    )

class CognitoSettings(BaseSettings):
    # Ustawienia dla AWS Cognito
    COGNITO_REGION: str = "<twoj-region-np-eu-west-1>"
    COGNITO_USER_POOL_ID: str = "<twoj-user-pool-id>"
    COGNITO_APP_CLIENT_ID: str = "<twoj-app-client-id>"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

# Tworzymy instancję klasy z ustawieniami
db_settings = DatabaseSettings()
cognito_settings = CognitoSettings()
