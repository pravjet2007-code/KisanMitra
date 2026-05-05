from fastapi import Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from typing import Optional, List
from ..db.database import get_db
from ..db import models
from ..core import security

def get_current_user(authorization: Optional[str] = Header(None), db: Session = Depends(get_db)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Invalid authorization header"
        )
    
    token = authorization.split(" ")[1]
    payload = security.decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Token expired or invalid"
        )
    
    phone = payload.get("sub")
    user = db.query(models.User).filter(models.User.phone_number == phone).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="User not found"
        )
    
    return user

class RoleChecker:
    def __init__(self, allowed_roles: List[models.UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: models.User = Depends(get_current_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation not permitted for role: {user.role}"
            )
        return user
