import jwt
from datetime import datetime, timedelta
from typing import Optional

SECRET_KEY = "kisanmitra_ultra_secure_dev_key_switch_in_prod"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7 # 7 days validity

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_access_token(token: str):
    try:
        decoded_data = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return decoded_data
    except Exception:
        return None
