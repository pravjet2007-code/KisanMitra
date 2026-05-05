from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...db.database import get_db
from ...schemas import order
from ...crud import crud_order
from ...db import models
from .. import deps

router = APIRouter()

@router.post("/", response_model=order.Order)
def create_order(order_in: order.OrderCreate, db: Session = Depends(get_db)):
    return crud_order.create_order(db=db, order_in=order_in)

@router.get("/{order_id}", response_model=order.Order)
def read_order(order_id: int, db: Session = Depends(get_db)):
    db_order = crud_order.get_order(db, order_id=order_id)
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.get("/buyer/{buyer_id}", response_model=List[order.Order])
def read_orders_by_buyer(buyer_id: int, db: Session = Depends(get_db)):
    return crud_order.get_orders_by_buyer(db, buyer_id=buyer_id)

@router.patch("/{order_id}/status", response_model=order.Order)
def update_order_status(order_id: int, status: order.OrderStatus, db: Session = Depends(get_db)):
    db_order = crud_order.update_order_status(db, order_id=order_id, status=status)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@router.delete("/{order_id}")
def delete_order(order_id: int, db: Session = Depends(get_db)):
    db_order = crud_order.delete_order(db, order_id=order_id)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order deleted successfully"}

@router.post("/checkout", response_model=order.Order)
def checkout(shipping_address_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_user)):
    """
    Finalizes the purchase by converting cart items into an order.
    """
    return crud_order.checkout_cart(db, buyer_id=current_user.user_id, shipping_address_id=shipping_address_id)

@router.get("/uuid/{order_uuid}", response_model=order.Order)
def read_order_by_uuid(order_uuid: str, db: Session = Depends(get_db), current_user: models.User = Depends(deps.get_current_user)):
    """
    Fetch an order by its unique UUID for secure tracking.
    """
    db_order = db.query(models.Order).filter(models.Order.order_uuid == order_uuid).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Ensure only the buyer or the seller of items in the order can see it
    # For now, we'll just check if current_user is the buyer.
    if db_order.buyer_id != current_user.user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this order")
        
    return db_order
