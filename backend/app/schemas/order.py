from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID
from datetime import datetime
from decimal import Decimal
from ..db.models import OrderStatus, PaymentStatus
from .product import Product

class OrderItemBase(BaseModel):
    product_id: int
    quantity: Decimal

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    order_item_id: int
    seller_id: int
    price_at_purchase: Decimal
    product: Product

    class Config:
        from_attributes = True

class OrderStatusHistoryBase(BaseModel):
    status: OrderStatus
    comments: Optional[str] = None

class OrderStatusHistory(OrderStatusHistoryBase):
    history_id: int
    updated_by: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

class PaymentBase(BaseModel):
    transaction_id: Optional[str] = None
    amount: Decimal
    payment_method: Optional[str] = None
    status: PaymentStatus = PaymentStatus.PENDING

class Payment(PaymentBase):
    payment_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    buyer_id: int
    shipping_address_id: Optional[int] = None

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class Order(OrderBase):
    order_id: int
    order_uuid: UUID # Fixed type
    total_amount: Decimal
    current_status: OrderStatus
    created_at: datetime
    items: List[OrderItem]
    status_history: List[OrderStatusHistory]
    payment: Optional[Payment]

    class Config:
        from_attributes = True
