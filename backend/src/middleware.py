"""
JWT Verification Middleware for the Todo Web Application - Backend Only
"""
from datetime import datetime, timedelta
from typing import Optional
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from .config import settings
from .logging_config import get_logger


logger = get_logger(__name__)

# Security scheme
security = HTTPBearer()


def create_access_token(data: dict, expires_delta: timedelta = None, expires_delta_minutes: int = None):
    """
    Create a new access token with the given data

    Args:
        data: Data to encode in the token (typically user information)
        expires_delta: Expiration time delta (defaults to configured expiration)
        expires_delta_minutes: Alternative way to specify expiration in minutes

    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()

    if expires_delta_minutes is not None:
        expire = datetime.utcnow() + timedelta(minutes=expires_delta_minutes)
    elif expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire.timestamp()})

    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode an access token and return the payload"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Extract the current user_id from the JWT token"""
    token = credentials.credentials

    payload = decode_access_token(token)
    user_id: Optional[str] = payload.get("sub")

    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user_id