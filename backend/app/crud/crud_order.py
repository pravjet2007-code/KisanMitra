from sqlalchemy.orm import Session
from fastapi import HTTPException
from ..db import models
from ..schemas import order

def create_order(db: Session, order_in: order.OrderCreate):
    # Start transaction is handled by FastAPI dependency or db.begin() if needed manually
    # Here we use the session and commit at the end.
    
    total_amount = 0
    order_items_to_create = []
    
    # 1. Validate products and calculate total
    for item in order_in.items:
        db_product = db.query(models.Product).filter(models.Product.product_id == item.product_id).with_for_update().first()
        
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
        
        if db_product.stock_quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Insufficient stock for product {db_product.name}")
        
        # Deduct stock
        db_product.stock_quantity -= item.quantity
        
        item_total = db_product.price_per_unit * item.quantity
        total_amount += item_total
        
        order_items_to_create.append({
            "product_id": db_product.product_id,
            "seller_id": db_product.seller_id,
            "quantity": item.quantity,
            "price_at_purchase": db_product.price_per_unit
        })

    # 2. Create Order
    db_order = models.Order(
        buyer_id=order_in.buyer_id,
        total_amount=total_amount,
        current_status=models.OrderStatus.PENDING
    )
    db.add(db_order)
    db.flush() # Get order_id

    # 3. Create Order Items
    for item_data in order_items_to_create:
        db_item = models.OrderItem(
            order_id=db_order.order_id,
            **item_data
        )
        db.add(db_item)

    try:
        db.commit()
        db.refresh(db_order)
        return db_order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Order creation failed")

def get_order(db: Session, order_id: int):
    return db.query(models.Order).filter(models.Order.order_id == order_id).first()

def get_orders_by_buyer(db: Session, buyer_id: int):
    return db.query(models.Order).filter(models.Order.buyer_id == buyer_id).all()

def update_order_status(db: Session, order_id: int, status: models.OrderStatus):
    db_order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if not db_order:
        return None
    db_order.current_status = status
    
    # Track status history
    history = models.OrderStatusHistory(order_id=order_id, status=status)
    db.add(history)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def delete_order(db: Session, order_id: int):
    db_order = db.query(models.Order).filter(models.Order.order_id == order_id).first()
    if db_order:
        db.delete(db_order)
        db.commit()
    return db_order

def checkout_cart(db: Session, buyer_id: int, shipping_address_id: int):
    # 1. Fetch cart items
    cart_items = db.query(models.CartItem).filter(models.CartItem.buyer_id == buyer_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
    
    total_amount = 0
    order_items_data = []
    
    try:
        for item in cart_items:
            product = db.query(models.Product).with_for_update().filter(models.Product.product_id == item.product_id).first()
            if not product or product.stock_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Insufficient stock for {product.name if product else 'Unknown Product'}")
            
            # Deduct stock
            product.stock_quantity -= item.quantity
            
            item_total = product.price_per_unit * item.quantity
            total_amount += item_total
            
            order_items_data.append({
                "product_id": item.product_id,
                "seller_id": product.seller_id,
                "quantity": item.quantity,
                "price_at_purchase": product.price_per_unit
            })

        # 2. Create Order
        db_order = models.Order(
            buyer_id=buyer_id,
            total_amount=total_amount,
            shipping_address_id=shipping_address_id,
            current_status=models.OrderStatus.PENDING
        )
        db.add(db_order)
        db.flush()

        # 3. Create Order Items
        for data in order_items_data:
            db_item = models.OrderItem(order_id=db_order.order_id, **data)
            db.add(db_item)

        # 4. Clear Cart
        db.query(models.CartItem).filter(models.CartItem.buyer_id == buyer_id).delete()
        
        # 5. Add Status History
        history = models.OrderStatusHistory(order_id=db_order.order_id, status=models.OrderStatus.PENDING, comments="Order placed via cart checkout")
        db.add(history)

        db.commit()
        db.refresh(db_order)
        return db_order
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Checkout failed")
