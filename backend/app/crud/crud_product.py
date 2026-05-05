from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List
from ..db import models
from ..schemas import product

def get_product(db: Session, product_id: int):
    # Fetch product with rating summary
    db_product = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if db_product:
        stats = db.query(
            func.avg(models.Review.rating).label("avg_rating"),
            func.count(models.Review.review_id).label("count")
        ).filter(models.Review.product_id == product_id).first()
        
        db_product.average_rating = float(stats.avg_rating) if stats.avg_rating else 0.0
        db_product.review_count = stats.count if stats.count else 0
        
    return db_product

def get_product_by_uuid(db: Session, product_uuid: str):
    db_product = db.query(models.Product).filter(models.Product.product_uuid == product_uuid).first()
    if db_product:
        stats = db.query(
            func.avg(models.Review.rating).label("avg_rating"),
            func.count(models.Review.review_id).label("count")
        ).filter(models.Review.product_id == db_product.product_id).first()
        
        db_product.average_rating = float(stats.avg_rating) if stats.avg_rating else 0.0
        db_product.review_count = stats.count if stats.count else 0
        
    return db_product

def get_products(
    db: Session, 
    skip: int = 0, 
    limit: int = 100, 
    q: Optional[str] = None, 
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    min_rating: Optional[int] = None,
    sort_by: Optional[str] = "newest"
):
    query = db.query(models.Product).filter(models.Product.is_active == True)
    
    # Filtering logic
    if q:
        query = query.filter(or_(models.Product.name.ilike(f"%{q}%"), models.Product.description.ilike(f"%{q}%")))
    if category_id:
        query = query.filter(models.Product.category_id == category_id)
    if min_price is not None:
        query = query.filter(models.Product.price_per_unit >= min_price)
    if max_price is not None:
        query = query.filter(models.Product.price_per_unit <= max_price)
        
    # Get total count before pagination
    total_count = query.count()

    # Join for ratings if needed for filtering/display
    # We'll calculate ratings for the current page items
    if sort_by == "price_asc":
        query = query.order_by(models.Product.price_per_unit.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price_per_unit.desc())
    else:
        query = query.order_by(models.Product.created_at.desc())

    items = query.offset(skip).limit(limit).all()
    
    # Calculate ratings for each item in the results
    for item in items:
        stats = db.query(
            func.avg(models.Review.rating).label("avg_rating"),
            func.count(models.Review.review_id).label("count")
        ).filter(models.Review.product_id == item.product_id).first()
        item.average_rating = float(stats.avg_rating) if stats.avg_rating else 0.0
        item.review_count = stats.count if stats.count else 0

    return items, total_count

def create_product(db: Session, product_in: product.ProductCreate):
    db_product = models.Product(**product_in.model_dump(exclude={"average_rating", "review_count"}))
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product_in: product.ProductUpdate):
    db_product = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if not db_product:
        return None
    update_data = product_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_product, field, value)
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Product).filter(models.Product.product_id == product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return db_product
