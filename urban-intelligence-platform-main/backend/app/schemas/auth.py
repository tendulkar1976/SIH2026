from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    username: str
    password: str

class RegisterRequest(BaseModel):
    username: str
    password: str
    role: str = "admin"

class AuthenticatedUserResponse(BaseModel):
    id: str
    username: str
    role: str

class TokenResponse(BaseModel):
    accessToken: str
    tokenType: str
    user: AuthenticatedUserResponse
