"""
Authentication API endpoints for the Todo Web Application - Backend Only
"""
import re
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt
from jose.exceptions import JWTError
from src.config import settings
from src.middleware import decode_access_token, create_access_token
from src.logging_config import get_logger
from src.models.user import User, UserCreate, UserLogin, UserRead
from src.database import get_session
from sqlmodel import Session, select
from typing import Optional


logger = get_logger(__name__)
router = APIRouter()
security = HTTPBearer()




@router.post("/refresh-token")
def refresh_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Refresh an existing token by generating a new one with extended validity
    """
    try:
        token = credentials.credentials
        payload = decode_access_token(token)

        # Extract user information from the current token
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create a new token with the same user info but extended expiration
        new_token_data = {"sub": user_id}
        new_token = create_access_token(data=new_token_data)

        return {
            "access_token": new_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60  # seconds
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while refreshing the token"
        )


@router.get("/validate-token")
def validate_token(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Validate an existing token and return user information
    """
    try:
        token = credentials.credentials
        payload = decode_access_token(token)

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return {
            "valid": True,
            "user_id": user_id,
            "token_payload": payload
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error validating token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while validating the token"
        )


def validate_password_strength(password: str):
    """
    Validate password strength according to security requirements
    """
    if len(password) < 8:
        raise ValueError('Password must be at least 8 characters long')

    # Check for at least one uppercase letter
    has_upper = any(c.isupper() for c in password)
    if not has_upper:
        raise ValueError('Password must contain at least one uppercase letter')

    # Check for at least one lowercase letter
    has_lower = any(c.islower() for c in password)
    if not has_lower:
        raise ValueError('Password must contain at least one lowercase letter')

    # Check for at least one digit
    has_digit = any(c.isdigit() for c in password)
    if not has_digit:
        raise ValueError('Password must contain at least one digit')

    # Check for at least one special character
    special_chars = set('!@#$%^&*(),.?":{}|<>')
    has_special = any(c in special_chars for c in password)
    if not has_special:
        raise ValueError('Password must contain at least one special character')

@router.post("/signup")
def signup(user_create: UserCreate, db: Session = Depends(get_session)):
    """
    Create a new user account and return access token
    """
    try:
        # Validate password strength
        try:
            validate_password_strength(user_create.password)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )

        # Check if user with email already exists
        existing_user = db.exec(select(User).where(User.email == user_create.email)).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered. Please try logging in."
            )

        # Hash the password
        try:
            hashed_password = User.hash_password(user_create.password)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )
        except Exception as e:
            # Catch any other password hashing errors (like bcrypt limitations)
            if "password cannot be longer than 72 bytes" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must not exceed 72 bytes in length"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"An error occurred while processing your password: {str(e)}"
                )

        # Create new user
        db_user = User(
            email=user_create.email,
            name=user_create.name,
            hashed_password=hashed_password
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Create access token for the new user
        access_token = create_access_token(data={"sub": db_user.id})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "email": db_user.email,
                "name": db_user.name,
                "created_at": db_user.created_at
            }
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating your account"
        )


@router.post("/login")
def login(user_login: UserLogin, db: Session = Depends(get_session)):
    """
    Authenticate user and return access token
    """
    try:
        # Find user by email
        user = db.exec(select(User).where(User.email == user_login.email)).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify password
        if not user.verify_password(user_login.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect password. Please try again.",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Create access token
        access_token = create_access_token(data={"sub": user.id})

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name,
                "created_at": user.created_at
            }
        }
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred during authentication"
        )


from pydantic import BaseModel

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str

@router.post("/forgot-password")
def forgot_password(request_data: ForgotPasswordRequest):
    """
    Generate a password reset token and send it to the user's email
    """
    email = request_data.email
    try:
        from src.database import get_session
        from src.models.user import User
        from sqlmodel import Session, select
        from src.config import settings
        from src.middleware import create_access_token

        # Get database session manually since this endpoint doesn't use dependency injection for session
        db = next(get_session())

        # Find user by email
        user = db.exec(select(User).where(User.email == email)).first()
        if not user:
            # For security, we don't reveal if the email exists or not
            return {"message": "If this email exists in our system, you will receive a reset link shortly."}

        # Create a password reset token (valid for 15 minutes)
        reset_token_data = {"sub": user.id, "type": "password_reset"}
        reset_token = create_access_token(data=reset_token_data, expires_delta_minutes=15)

        # Log the reset link to console (in real app, send email)
        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        print(f"Password reset link for {email}: {reset_link}")

        return {"message": "If this email exists in our system, you will receive a reset link shortly."}

    except Exception as e:
        logger.error(f"Error in forgot password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request"
        )


@router.post("/reset-password")
def reset_password(request_data: ResetPasswordRequest):
    """
    Reset user's password using the reset token
    """
    token = request_data.token
    new_password = request_data.new_password
    try:
        from jose import jwt
        from jose.exceptions import JWTError
        from src.config import settings
        from src.database import get_session
        from src.models.user import User
        from sqlmodel import Session, select

        # Get database session manually
        db = next(get_session())

        try:
            # Decode the reset token
            payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])

            # Verify it's a password reset token
            token_type = payload.get("type")
            if token_type != "password_reset":
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid reset token"
                )

            user_id = payload.get("sub")
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid reset token"
                )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )

        # Find user by ID
        user = db.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        # Validate new password strength
        try:
            validate_password_strength(new_password)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )

        # Hash the new password
        try:
            hashed_new_password = User.hash_password(new_password)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )
        except Exception as e:
            if "password cannot be longer than 72 bytes" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must not exceed 72 bytes in length"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"An error occurred while processing your password: {str(e)}"
                )

        # Update the user's password
        user.hashed_password = hashed_new_password
        db.add(user)
        db.commit()

        return {"message": "Password reset successfully"}

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error in reset password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while resetting your password"
        )


@router.put("/change-password")
def change_password(request_data: ChangePasswordRequest, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_session)):
    """
    Change user's password after verifying the old password
    """
    old_password = request_data.old_password
    new_password = request_data.new_password
    try:
        token = credentials.credentials
        payload = decode_access_token(token)

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database
        user = db.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Verify old password
        if not user.verify_password(old_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password. Please try again."
            )

        # Validate new password strength
        try:
            validate_password_strength(new_password)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )

        # Hash the new password
        try:
            hashed_new_password = User.hash_password(new_password)
        except ValueError as ve:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(ve)
            )
        except Exception as e:
            if "password cannot be longer than 72 bytes" in str(e):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Password must not exceed 72 bytes in length"
                )
            else:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"An error occurred while processing your password: {str(e)}"
                )

        # Update the user's password
        user.hashed_password = hashed_new_password
        db.add(user)
        db.commit()

        return {"message": "Password changed successfully"}

    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error changing password: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while changing your password"
        )


@router.post("/logout")
def logout():
    """
    Logout endpoint (currently just a placeholder - frontend should clear local storage)
    """
    return {"message": "Successfully logged out"}


@router.get("/me", response_model=UserRead)
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_session)):
    """
    Get current authenticated user's information
    """
    try:
        token = credentials.credentials
        payload = decode_access_token(token)

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: no user ID found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Get user from database
        user = db.get(User, user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return user
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error getting current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while retrieving user information"
        )