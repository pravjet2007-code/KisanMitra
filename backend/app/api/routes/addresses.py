from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...db.database import get_db
from ...schemas import address
from ...crud import crud_address

router = APIRouter()

@router.post("/", response_model=address.Address)
def create_address(address_in: address.AddressCreate, db: Session = Depends(get_db)):
    return crud_address.create_address(db=db, address_in=address_in)

@router.get("/user/{user_id}", response_model=List[address.Address])
def read_user_addresses(user_id: int, db: Session = Depends(get_db)):
    return crud_address.get_user_addresses(db, user_id=user_id)

@router.put("/{address_id}", response_model=address.Address)
def update_address(address_id: int, address_in: address.AddressBase, db: Session = Depends(get_db)):
    db_address = crud_address.update_address(db, address_id=address_id, address_in=address_in)
    if not db_address:
        raise HTTPException(status_code=404, detail="Address not found")
    return db_address

@router.delete("/{address_id}")
def delete_address(address_id: int, db: Session = Depends(get_db)):
    db_address = crud_address.delete_address(db, address_id=address_id)
    if not db_address:
        raise HTTPException(status_code=404, detail="Address not found")
    return {"message": "Address deleted successfully"}
