from sqlalchemy import Column, Integer, String, DateTime
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    phone = Column(String(15), unique=True, index=True, nullable=False)
    role = Column(String(20), default="farmer") # 'farmer' or 'buyer'
    
    # Farmer Profile Data
    name = Column(String(100), nullable=True)
    location = Column(String(200), nullable=True)
    farm_size = Column(String(50), nullable=True) # e.g. "5 Acres"
    crop_type = Column(String(100), nullable=True) # e.g. "Wheat"
    preferred_language = Column(String(10), default="en")
    
    created_at = Column(DateTime, default=datetime.utcnow)
