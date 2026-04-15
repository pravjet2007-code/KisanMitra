from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class SendOTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)

class VerifyOTPRequest(BaseModel):
    phone: str = Field(..., min_length=10, max_length=15)
    otp: str = Field(..., min_length=6, max_length=6)

class Token(BaseModel):
    access_token: str
    token_type: str
    is_profile_complete: bool

class ProfileUpdate(BaseModel):
    name: str
    location: str
    farm_size: str
    crop_type: str
    preferred_language: str

class UserResponse(BaseModel):
    id: int
    phone: str
    role: str
    name: Optional[str]
    location: Optional[str]
    farm_size: Optional[str]
    crop_type: Optional[str]
    preferred_language: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True
