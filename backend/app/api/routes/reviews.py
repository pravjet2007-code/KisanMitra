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
    # Check if the reviewer_id exists in the database
    from ...db import models
    user_exists = db.query(models.User).filter(models.User.user_id == review_in.reviewer_id).first()
    if not user_exists:
        name = review_in.reviewer_name or f"Farmer {review_in.reviewer_id}"
        new_user = models.User(
            user_id=review_in.reviewer_id,
            full_name=name,
            phone_number=f"9999999{review_in.reviewer_id:03d}"[-10:],
            password_hash="mock_password",
            role=models.UserRole.FARMER,
            is_verified=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    return crud_review.create_review(db=db, review_in=review_in)
