import os
import shutil
from pathlib import Path

base_dir = Path('c:/Users/Leszek/Desktop/Nowy folder (12)/backend/sikora/Projekt-BIAWC-main/sklepik/backend/microservices')
targets = ['products-service', 'cart-service', 'orders-service']

# 1. Update requirements.txt
for tgt in targets:
    req_file = base_dir / tgt / 'requirements.txt'
    if req_file.exists():
        content = req_file.read_text(encoding='utf-8')
        if 'python-jose' not in content:
            req_file.write_text(content.strip() + '\npython-jose[cryptography]==3.3.0\nrequests==2.31.0\n', encoding='utf-8')
            print(f'Added dependencies to {tgt}/requirements.txt')

# 2. Add CognitoSettings to settings.py
cognito_settings_str = """

class CognitoSettings(BaseSettings):
    COGNITO_REGION: str = "<twoj-region-np-eu-west-1>"
    COGNITO_USER_POOL_ID: str = "<twoj-user-pool-id>"
    COGNITO_APP_CLIENT_ID: str = "<twoj-app-client-id>"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

cognito_settings = CognitoSettings()
"""

for tgt in targets:
    settings_file = base_dir / tgt / 'app' / 'core' / 'settings.py'
    if settings_file.exists():
        content = settings_file.read_text(encoding='utf-8')
        if 'CognitoSettings' not in content:
            settings_file.write_text(content.strip() + cognito_settings_str, encoding='utf-8')
            print(f'Appended CognitoSettings to {tgt}/app/core/settings.py')
    else:
        # Create it for cart-service
        content = 'from pydantic_settings import BaseSettings, SettingsConfigDict\n' + cognito_settings_str
        settings_file.write_text(content, encoding='utf-8')
        print(f'Created {tgt}/app/core/settings.py')

# 3. Copy security.py
src_security = base_dir / 'user-service' / 'app' / 'core' / 'security.py'
for tgt in targets:
    dst_security = base_dir / tgt / 'app' / 'core' / 'security.py'
    shutil.copy2(src_security, dst_security)
    print(f'Copied security.py to {tgt}')
