from pydantic_settings import BaseSettings, SettingsConfigDict


class DatabaseSettings(BaseSettings):
    DATABASE_URL: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


class CognitoSettings(BaseSettings):
    COGNITO_REGION: str = "<twoj-region-np-eu-west-1>"
    COGNITO_USER_POOL_ID: str = "<twoj-user-pool-id>"
    COGNITO_APP_CLIENT_ID: str = "<twoj-app-client-id>"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )


db_settings = DatabaseSettings()
cognito_settings = CognitoSettings()
