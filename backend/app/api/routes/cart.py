from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...db.database import get_db
from ...schemas import cart
from ...crud import crud_cart

router = APIRouter()

@router.get("/{buyer_id}", response_model=List[cart.CartItem])
def read_cart(buyer_id: int, db: Session = Depends(get_db)):
    return crud_cart.get_cart_items(db, buyer_id=buyer_id)

@router.post("/", response_model=cart.CartItem)
def add_item_to_cart(item_in: cart.CartItemCreate, db: Session = Depends(get_db)):
    return crud_cart.add_to_cart(db=db, item_in=item_in)

@router.delete("/{cart_item_id}")
def remove_item_from_cart(cart_item_id: int, db: Session = Depends(get_db)):
    db_item = crud_cart.remove_from_cart(db, cart_item_id=cart_item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}
