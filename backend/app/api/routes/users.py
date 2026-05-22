from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...db import models
from .. import deps
from typing import Optional

router = APIRouter()

@router.get("/profile")
def get_profile(
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Fetch the authenticated user's profile, resolving locations dynamically
    from their default addresses.
    """
    # Dynamic location lookup from addresses
    address_list = db.query(models.Address).filter(models.Address.user_id == current_user.user_id).all()
    location = ""
    default_address = next((a for a in address_list if a.is_default), None)
    if not default_address and address_list:
        default_address = address_list[0]
    if default_address:
        location = f"{default_address.city}, {default_address.state}"

    return {
        "user_id": current_user.user_id,
        "full_name": current_user.full_name,
        "phone_number": current_user.phone_number,
        "email": current_user.email,
        "role": current_user.role,
        "is_verified": current_user.is_verified,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "location": location,
        "farm_size": getattr(current_user, "farm_size", None),
        "crop_type": getattr(current_user, "crop_type", None),
        "business_name": getattr(current_user, "business_name", None),
        "business_type": getattr(current_user, "business_type", None),
        "preferred_language": getattr(current_user, "preferred_language", "en")
    }

@router.put("/profile")
def update_profile(
    profile_data: dict,
    current_user: models.User = Depends(deps.get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the profile information of the authenticated user.
    """
    if "full_name" in profile_data:
        current_user.full_name = profile_data["full_name"]
    if "email" in profile_data:
        current_user.email = profile_data["email"]

    # Optional fields safely updated
    for field in ["farm_size", "crop_type", "business_name", "business_type", "preferred_language"]:
        if field in profile_data:
            setattr(current_user, field, profile_data[field])

    # Handle location conversion to address record
    if "location" in profile_data and profile_data["location"]:
        parts = profile_data["location"].split(",")
        city = parts[0].strip() if len(parts) > 0 else ""
        state = parts[1].strip() if len(parts) > 1 else ""

        # Update default address or first address
        addr = db.query(models.Address).filter(
            models.Address.user_id == current_user.user_id,
            models.Address.is_default == True
        ).first()
        if not addr:
            addr = db.query(models.Address).filter(models.Address.user_id == current_user.user_id).first()

        if addr:
            addr.city = city
            addr.state = state
        else:
            new_addr = models.Address(
                user_id=current_user.user_id,
                city=city,
                state=state,
                is_default=True,
                address_type="farm" if current_user.role == models.UserRole.FARMER else "business",
                street_address="Primary Location"
            )
            db.add(new_addr)

    db.commit()
    db.refresh(current_user)

    return get_profile(current_user=current_user, db=db)
