from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, List
from ...db.database import get_db
from ...db import models
from .. import deps

router = APIRouter()

@router.get("/farmer/dashboard")
def get_farmer_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(deps.RoleChecker([models.UserRole.FARMER, models.UserRole.VENDOR]))
):
    """
    Returns sales statistics and low-stock alerts for the authenticated farmer.
    """
    farmer_id = current_user.user_id
    
    # 1. Total Revenue
    total_revenue = db.query(func.sum(models.OrderItem.price_at_purchase * models.OrderItem.quantity))\
        .filter(models.OrderItem.seller_id == farmer_id).scalar() or 0
    
    # 2. Total Orders Sold
    total_orders = db.query(func.count(models.OrderItem.order_item_id))\
        .filter(models.OrderItem.seller_id == farmer_id).scalar() or 0
    
    # 3. Top Selling Products
    top_products = db.query(
        models.Product.name, 
        func.sum(models.OrderItem.quantity).label("total_sold")
    ).join(models.OrderItem)\
     .filter(models.OrderItem.seller_id == farmer_id)\
     .group_by(models.Product.product_id)\
     .order_by(func.sum(models.OrderItem.quantity).desc())\
     .limit(5).all()
    
    # 4. Low Stock Alerts (quantity < 10)
    low_stock_products = db.query(models.Product)\
        .filter(models.Product.seller_id == farmer_id, models.Product.stock_quantity < 10).all()
    
    return {
        "revenue": float(total_revenue),
        "total_sales": total_orders,
        "top_products": [{"name": p[0], "sold": float(p[1])} for p in top_products],
        "low_stock_alerts": [
            {"product_id": p.product_id, "name": p.name, "stock": float(p.stock_quantity)} 
            for p in low_stock_products
        ]
    }
