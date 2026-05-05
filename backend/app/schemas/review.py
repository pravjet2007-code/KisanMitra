from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    reviewer_id: int

class Review(ReviewBase):
    review_id: int
    reviewer_id: int
    created_at: datetime

    class Config:
        from_attributes = True
