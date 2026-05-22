import base64
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import List, Optional
from ...db.database import get_db
from ...schemas import product
from ...crud import crud_product
from ...db import models
from .. import deps

router = APIRouter()

@router.post("/", response_model=product.Product)
def create_product(
    product_in: product.ProductCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.RoleChecker([models.UserRole.FARMER, models.UserRole.VENDOR]))
):
    # Ensure seller_id matches current user
    product_in.seller_id = current_user.user_id
    return crud_product.create_product(db=db, product_in=product_in)

@router.get("/", response_model=product.ProductPaginationResponse)
def read_products(
    skip: int = 0, 
    limit: int = 100, 
    q: Optional[str] = Query(None, description="Search by name or description"),
    category_id: Optional[int] = Query(None, description="Filter by category ID"),
    min_price: Optional[float] = Query(None, description="Minimum price"),
    max_price: Optional[float] = Query(None, description="Maximum price"),
    min_rating: Optional[int] = Query(None, description="Minimum average rating"),
    farming_method: Optional[str] = Query(None, description="Filter by farming method (organic, traditional)"),
    sort_by: Optional[str] = Query("newest", description="Sorting: newest, price_asc, price_desc, score"),
    db: Session = Depends(get_db)
):
    items, total = crud_product.get_products(
        db, skip=skip, limit=limit, q=q, 
        category_id=category_id, min_price=min_price, 
        max_price=max_price, min_rating=min_rating, 
        farming_method=farming_method, sort_by=sort_by
    )
    
    pages = (total + limit - 1) // limit if limit > 0 else 1
    current_page = (skip // limit) + 1 if limit > 0 else 1
    
    return {
        "total": total,
        "page": current_page,
        "limit": limit,
        "pages": pages,
        "items": items
    }

@router.get("/categories", response_model=List[product.Category])
def read_categories(db: Session = Depends(get_db)):
    """
    Get all active product categories from the database.
    """
    return db.query(models.Category).all()


import os
import uuid

@router.post("/process-image")
async def process_image_to_db(file: UploadFile = File(...)):
    """
    Saves an uploaded image to the local file system and returns the relative URL.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Generate a unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # Determine save path
        save_directory = "static/uploads"
        file_path = os.path.join(save_directory, unique_filename)
        
        # Save the file
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
            
        # Format the URL (assuming the backend is served at root, or you can prepend server URL)
        # Using a relative URL so the frontend can prepend its known API base URL
        image_url = f"/static/uploads/{unique_filename}"
        
        return {"image_data": image_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")

@router.get("/{product_id}", response_model=product.Product)
def read_product(product_id: int, db: Session = Depends(get_db)):
    db_product = crud_product.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.get("/uuid/{product_uuid}", response_model=product.Product)
def read_product_by_uuid(product_uuid: str, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.product_uuid == product_uuid).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # We still need to calculate the ratings for this response
    from ...crud import crud_product
    # Reuse the rating calculation logic from crud_product.get_product
    # But since I'm in the route, I'll just call a helper or do it here.
    # Actually, I'll add get_product_by_uuid to crud_product for cleanliness.
    return crud_product.get_product_by_uuid(db, product_uuid=product_uuid)

@router.put("/{product_id}", response_model=product.Product)
def update_product(
    product_id: int, 
    product_in: product.ProductUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.RoleChecker([models.UserRole.FARMER, models.UserRole.VENDOR]))
):
    db_product = crud_product.get_product(db, product_id=product_id)
    if not db_product or db_product.seller_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to edit this product")
    
    return crud_product.update_product(db, product_id=product_id, product_in=product_in)

@router.delete("/{product_id}")
def delete_product(
    product_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.RoleChecker([models.UserRole.FARMER, models.UserRole.VENDOR]))
):
    db_product = crud_product.get_product(db, product_id=product_id)
    if not db_product or db_product.seller_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this product")
        
    crud_product.delete_product(db, product_id=product_id)
    return {"message": "Product deleted successfully"}
