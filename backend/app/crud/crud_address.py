from sqlalchemy.orm import Session
from ..db import models
from ..schemas import address

def get_user_addresses(db: Session, user_id: int):
    return db.query(models.Address).filter(models.Address.user_id == user_id).all()

def create_address(db: Session, address_in: address.AddressCreate):
    # If this is the default, unset other defaults for this user
    if address_in.is_default:
        db.query(models.Address).filter(models.Address.user_id == address_in.user_id).update({"is_default": False})
    
    db_address = models.Address(**address_in.model_dump())
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    return db_address

def update_address(db: Session, address_id: int, address_in: address.AddressBase):
    db_address = db.query(models.Address).filter(models.Address.address_id == address_id).first()
    if not db_address:
        return None
    
    # If this is being set as default, unset others for this user
    if address_in.is_default:
        db.query(models.Address).filter(models.Address.user_id == db_address.user_id).update({"is_default": False})
        
    update_data = address_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_address, field, value)
    
    db.commit()
    db.refresh(db_address)
    return db_address

def delete_address(db: Session, address_id: int):
    db_address = db.query(models.Address).filter(models.Address.address_id == address_id).first()
    if db_address:
        db.delete(db_address)
        db.commit()
    return db_address
