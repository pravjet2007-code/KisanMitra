from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...db import models
from ...schemas import order
from .. import deps

router = APIRouter()

@router.post("/capture")
def capture_payment(
    order_id: int, 
    transaction_id: str, 
    payment_method: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.get_current_user)
):
    """
    Mock endpoint to capture payment details after a successful frontend transaction.
    """
    db_order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if not db_order or db_order.buyer_id != current_user.user_id:
        raise HTTPException(status_code=404, detail="Order not found or not owned by user")
    
    # Update payment status
    db_payment = db.query(models.Payment).filter(models.Payment.order_id == order_id).first()
    if not db_payment:
        db_payment = models.Payment(
            order_id=order_id,
            amount=db_order.total_amount,
            transaction_id=transaction_id,
            payment_method=payment_method,
            status=models.PaymentStatus.SUCCESS
        )
        db.add(db_payment)
    else:
        db_payment.transaction_id = transaction_id
        db_payment.payment_method = payment_method
        db_payment.status = models.PaymentStatus.SUCCESS
    
    # Update order status
    db_order.current_status = models.OrderStatus.CONFIRMED
    history = models.OrderStatusHistory(
        order_id=order_id, 
        status=models.OrderStatus.CONFIRMED, 
        comments=f"Payment captured via {payment_method}. Transaction ID: {transaction_id}"
    )
    db.add(history)
    
    db.commit()
    return {"message": "Payment captured successfully", "order_id": order_id}
