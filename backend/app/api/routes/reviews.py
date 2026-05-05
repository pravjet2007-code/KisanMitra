from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...db.database import get_db
from ...schemas import review
from ...crud import crud_review

router = APIRouter()

@router.get("/product/{product_id}", response_model=List[review.Review])
def read_product_reviews(product_id: int, db: Session = Depends(get_db)):
    return crud_review.get_product_reviews(db, product_id=product_id)

@router.post("/", response_model=review.Review)
def create_review(review_in: review.ReviewCreate, db: Session = Depends(get_db)):
    return crud_review.create_review(db=db, review_in=review_in)
