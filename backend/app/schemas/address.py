from pydantic import BaseModel
from typing import Optional

class AddressBase(BaseModel):
    address_type: Optional[str] = None # 'Farm', 'Warehouse', 'Home'
    street_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    is_default: bool = False

class AddressCreate(AddressBase):
    user_id: int

class Address(AddressBase):
    address_id: int
    user_id: int

    class Config:
        from_attributes = True
