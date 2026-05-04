import urllib.request
import json
from jose import jwk, jwt
from jose.utils import base64url_decode
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.settings import cognito_settings

security = HTTPBearer()

def get_cognito_public_keys():
    region = cognito_settings.COGNITO_REGION
    user_pool_id = cognito_settings.COGNITO_USER_POOL_ID
    
    if region == "<twoj-region-np-eu-west-1>" or user_pool_id == "<twoj-user-pool-id>":
        print("Ostrzeżenie: Cognito nie jest skonfigurowane w .env. Pobieranie kluczy pominięte.")
        return []
        
    keys_url = f'https://cognito-idp.{region}.amazonaws.com/{user_pool_id}/.well-known/jwks.json'
    try:
        with urllib.request.urlopen(keys_url) as response:
            keys = json.loads(response.read())['keys']
            return keys
    except Exception as e:
        print(f"Error fetching Cognito keys: {e}")
        return []

# Zapisanie kluczy przy uruchamianiu
keys = get_cognito_public_keys()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Dependency (zależność) FastAPI używana w endpointach,
    które wymagają zalogowanego użytkownika. Zwraca 'claims' z tokena.
    Użycie:
    @router.get("/me")
    def get_me(user_claims = Depends(get_current_user)):
        return user_claims
    """
    token = credentials.credentials
    try:
        headers = jwt.get_unverified_headers(token)
        kid = headers.get('kid')
        
        key_index = -1
        for i in range(len(keys)):
            if kid == keys[i]['kid']:
                key_index = i
                break
                
        if key_index == -1:
            raise Exception('Klucz publiczny nie został znaleziony - token jest nieważny lub pochodzi z innej puli.')
            
        public_key = jwk.construct(keys[key_index])
        message, encoded_signature = str(token).rsplit('.', 1)
        decoded_signature = base64url_decode(encoded_signature.encode('utf-8'))
        
        if not public_key.verify(message.encode("utf8"), decoded_signature):
            raise Exception('Weryfikacja podpisu tokena nie powiodła się.')
            
        claims = jwt.get_unverified_claims(token)
        
        # Opcjonalnie można sprawdzić: claims['client_id'] == cognito_settings.COGNITO_APP_CLIENT_ID
        
        return claims
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Nieprawidłowy token lub błąd autoryzacji: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
