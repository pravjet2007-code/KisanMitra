from pydantic import BaseModel
from decimal import Decimal
from datetime import datetime
from .product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: Decimal

class CartItemCreate(CartItemBase):
    buyer_id: int

class CartItem(CartItemBase):
    cart_item_id: int
    buyer_id: int
    added_at: datetime
    product: Product

    class Config:
        from_attributes = True
