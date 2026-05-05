from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date, datetime
from decimal import Decimal
from ..db.models import ProductType

class ProductBase(BaseModel):
    name: str
    category_id: Optional[int] = None
    type: ProductType
    description: Optional[str] = None
    price_per_unit: Decimal
    unit_of_measure: Optional[str] = None
    stock_quantity: Decimal
    harvest_date: Optional[date] = None
    shelf_life_days: Optional[int] = None
    farming_method: Optional[str] = None
    image_url: Optional[str] = None
    average_rating: Optional[float] = 0.0
    review_count: Optional[int] = 0

class ProductCreate(ProductBase):
    seller_id: int

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    type: Optional[ProductType] = None
    description: Optional[str] = None
    price_per_unit: Optional[Decimal] = None
    unit_of_measure: Optional[str] = None
    stock_quantity: Optional[Decimal] = None
    harvest_date: Optional[date] = None
    shelf_life_days: Optional[int] = None
    farming_method: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None

class Product(ProductBase):
    product_id: int
    product_uuid: UUID
    seller_id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

class ProductPaginationResponse(BaseModel):
    total: int
    page: int
    limit: int
    pages: int
    items: List[Product]
