from sqlalchemy.orm import Session
from ..db import models
from ..schemas import review

def get_product_reviews(db: Session, product_id: int):
    return db.query(models.Review).filter(models.Review.product_id == product_id).all()

def create_review(db: Session, review_in: review.ReviewCreate):
    db_review = models.Review(**review_in.model_dump(exclude={"reviewer_name"}))
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review
