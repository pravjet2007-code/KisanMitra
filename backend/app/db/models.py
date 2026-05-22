import enum
import uuid
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum, DateTime, Boolean, Text, Date, Numeric, CheckConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

# Enums
class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    VENDOR = "VENDOR"
    BUYER = "BUYER"

class ProductType(str, enum.Enum):
    PRODUCE = "PRODUCE"
    INPUT = "INPUT"

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PROCESSING = "PROCESSING"
    SHIPPED = "SHIPPED"
    OUT_FOR_DELIVERY = "OUT_FOR_DELIVERY"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"

class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"

# Models
class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    user_uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()), server_default=func.gen_random_uuid()) # Added UUID
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    farm_size = Column(String(50), nullable=True)
    crop_type = Column(String(100), nullable=True)
    business_name = Column(String(255), nullable=True)
    business_type = Column(String(100), nullable=True)
    preferred_language = Column(String(50), nullable=True, default="en")


    addresses = relationship("Address", back_populates="user")
    products = relationship("Product", back_populates="seller")
    cart_items = relationship("CartItem", back_populates="buyer")
    orders = relationship("Order", back_populates="buyer")
    reviews = relationship("Review", back_populates="reviewer")

class Category(Base):
    __tablename__ = "categories"
    category_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    parent_category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=True)

    products = relationship("Product", back_populates="category")

class Address(Base):
    __tablename__ = "addresses"
    address_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    address_type = Column(String(50))
    street_address = Column(Text)
    city = Column(String(100))
    state = Column(String(100))
    pincode = Column(String(20))
    is_default = Column(Boolean, default=False)

    user = relationship("User", back_populates="addresses")

class Product(Base):
    __tablename__ = "products"
    product_id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    category_id = Column(Integer, ForeignKey("categories.category_id", ondelete="SET NULL"))
    type = Column(Enum(ProductType), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price_per_unit = Column(Numeric(10, 2), nullable=False)
    unit_of_measure = Column(String(50))
    stock_quantity = Column(Numeric(10, 2), nullable=False)
    harvest_date = Column(Date)
    shelf_life_days = Column(Integer)
    farming_method = Column(String(100))
    image_url = Column(Text)
    product_uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()), server_default=func.gen_random_uuid()) # Added UUID
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_active = Column(Boolean, default=True)

    seller = relationship("User", back_populates="products")
    category = relationship("Category", back_populates="products")
    reviews = relationship("Review", back_populates="product")

class CartItem(Base):
    __tablename__ = "cart_items"
    cart_item_id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    buyer = relationship("User", back_populates="cart_items")
    product = relationship("Product")

class Order(Base):
    __tablename__ = "orders"
    order_id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.user_id", ondelete="RESTRICT"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    order_uuid = Column(String(36), unique=True, index=True, default=lambda: str(uuid.uuid4()), server_default=func.gen_random_uuid()) # Added UUID
    shipping_address_id = Column(Integer, ForeignKey("addresses.address_id", ondelete="SET NULL"))
    current_status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    buyer = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")
    status_history = relationship("OrderStatusHistory", back_populates="order")
    payment = relationship("Payment", uselist=False, back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    order_item_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.product_id", ondelete="RESTRICT"), nullable=False)
    seller_id = Column(Integer, ForeignKey("users.user_id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Numeric(10, 2), nullable=False)
    price_at_purchase = Column(Numeric(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")
    seller = relationship("User")

class OrderStatusHistory(Base):
    __tablename__ = "order_status_history"
    history_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False)
    status = Column(Enum(OrderStatus), nullable=False)
    updated_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    comments = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="status_history")

class Payment(Base):
    __tablename__ = "payments"
    payment_id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id", ondelete="RESTRICT"), unique=True, nullable=False)
    transaction_id = Column(String(255), unique=True)
    amount = Column(Numeric(10, 2), nullable=False)
    payment_method = Column(String(100))
    status = Column(Enum(PaymentStatus), default=PaymentStatus.PENDING)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    order = relationship("Order", back_populates="payment")

class Review(Base):
    __tablename__ = "reviews"
    review_id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.product_id", ondelete="CASCADE"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (CheckConstraint('rating >= 1 AND rating <= 5', name='check_rating_range'),)

    product = relationship("Product", back_populates="reviews")
    reviewer = relationship("User", back_populates="reviews")
