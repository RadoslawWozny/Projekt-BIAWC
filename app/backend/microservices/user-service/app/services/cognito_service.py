import boto3
from app.core.settings import cognito_settings

class CognitoService:
    def __init__(self):
        # Inicjalizacja klienta Cognito
        # Oczekuje on poprawnej konfiguracji AWS (np. poprzez zmienne srodowiskowe AWS_ACCESS_KEY_ID itd.)
        self.client = boto3.client(
            'cognito-idp',
            region_name=cognito_settings.COGNITO_REGION
        )
        self.client_id = cognito_settings.COGNITO_APP_CLIENT_ID

    def register_user(self, email: str, password: str):
        try:
            response = self.client.sign_up(
                ClientId=self.client_id,
                Username=email,
                Password=password,
                UserAttributes=[
                    {"Name": "email", "Value": email}
                ]
            )
            return response
        except Exception as e:
            raise Exception(f"Błąd podczas rejestracji: {str(e)}")

    def confirm_registration(self, email: str, code: str):
        try:
            response = self.client.confirm_sign_up(
                ClientId=self.client_id,
                Username=email,
                ConfirmationCode=code
            )
            return response
        except Exception as e:
            raise Exception(f"Błąd podczas potwierdzania rejestracji: {str(e)}")

    def authenticate_user(self, email: str, password: str):
        try:
            response = self.client.initiate_auth(
                ClientId=self.client_id,
                AuthFlow='USER_PASSWORD_AUTH',
                AuthParameters={
                    'USERNAME': email,
                    'PASSWORD': password
                }
            )
            return response.get('AuthenticationResult')
        except Exception as e:
            raise Exception(f"Błąd logowania: {str(e)}")

    def refresh_tokens(self, refresh_token: str):
        try:
            response = self.client.initiate_auth(
                ClientId=self.client_id,
                AuthFlow='REFRESH_TOKEN_AUTH',
                AuthParameters={
                    'REFRESH_TOKEN': refresh_token
                }
            )
            return response.get('AuthenticationResult')
        except Exception as e:
            raise Exception(f"Błąd odświeżania tokena: {str(e)}")

cognito_service = CognitoService()
