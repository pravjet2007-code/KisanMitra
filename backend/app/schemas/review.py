from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ReviewBase(BaseModel):
    product_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None

class ReviewerInfo(BaseModel):
    user_id: int
    full_name: str

    class Config:
        from_attributes = True

class ReviewCreate(ReviewBase):
    reviewer_id: int
    reviewer_name: Optional[str] = None

class Review(ReviewBase):
    review_id: int
    reviewer_id: int
    created_at: datetime
    reviewer: Optional[ReviewerInfo] = None

    class Config:
        from_attributes = True

