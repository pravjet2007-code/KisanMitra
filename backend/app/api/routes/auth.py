from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ...db.database import get_db
from ...db import models
from ...schemas import user as user_schemas
from ...core import security

router = APIRouter()

@router.post("/send-otp")
def send_otp(request: user_schemas.SendOTPRequest):
    # Mock OTP logic
    print(f"DEBUG: Sending OTP 123456 to {request.phone}")
    return {"message": "OTP sent successfully"}

@router.post("/verify-otp", response_model=user_schemas.Token)
def verify_otp(request: user_schemas.VerifyOTPRequest, db: Session = Depends(get_db)):
    # Mock OTP validation
    if request.otp != "123456":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")
    
    user = db.query(models.User).filter(models.User.phone_number == request.phone).first()
    is_new_user = False
    
    if not user:
        if not request.full_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, 
                detail="Full name is required for new registration"
            )
        
        # Default to BUYER if not specified, or handle as needed
        user = models.User(
            phone_number=request.phone, 
            full_name=request.full_name,
            role=models.UserRole.BUYER 
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        is_new_user = True

    access_token = security.create_access_token(subject=user.phone_number)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "is_new_user": is_new_user,
        "user_id": user.user_id,
        "role": user.role,
        "full_name": user.full_name
    }
