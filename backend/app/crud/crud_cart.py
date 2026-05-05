from sqlalchemy.orm import Session
from ..db import models
from ..schemas import cart

def get_cart_items(db: Session, buyer_id: int):
    return db.query(models.CartItem).filter(models.CartItem.buyer_id == buyer_id).all()

def add_to_cart(db: Session, item_in: cart.CartItemCreate):
    # Check if item already in cart
    db_item = db.query(models.CartItem).filter(
        models.CartItem.buyer_id == item_in.buyer_id,
        models.CartItem.product_id == item_in.product_id
    ).first()
    
    if db_item:
        db_item.quantity += item_in.quantity
    else:
        db_item = models.CartItem(**item_in.model_dump())
        db.add(db_item)
    
    db.commit()
    db.refresh(db_item)
    return db_item

def remove_from_cart(db: Session, cart_item_id: int):
    db_item = db.query(models.CartItem).filter(models.CartItem.cart_item_id == cart_item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
    return db_item
