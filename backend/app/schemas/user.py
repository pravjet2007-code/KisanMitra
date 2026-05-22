from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from uuid import UUID
from datetime import datetime
from ..db.models import UserRole

class UserBase(BaseModel):
    full_name: str
    phone_number: str
    email: Optional[EmailStr] = None
    role: UserRole

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_verified: Optional[bool] = None

class User(UserBase):
    user_id: int
    user_uuid: UUID # Fixed type
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Auth Schemas
class SendOTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)

class VerifyOTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=6, max_length=6)
    full_name: Optional[str] = None 
    password: Optional[str] = None # Added for full compliance with the new schema

class Token(BaseModel):
    access_token: str
    token_type: str
    is_new_user: bool
    user_id: Optional[int] = None
    role: Optional[str] = None
    full_name: Optional[str] = None
