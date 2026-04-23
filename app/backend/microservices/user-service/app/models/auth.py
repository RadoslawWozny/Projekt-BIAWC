from pydantic import BaseModel, EmailStr

class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserConfirmRequest(BaseModel):
    email: EmailStr
    code: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str
