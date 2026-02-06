"""
User model for the Todo Web Application - Backend Only
"""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from pydantic import EmailStr
from sqlalchemy import Index
import uuid
from passlib.context import CryptContext


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


class UserBase(SQLModel):
    """Base model for User with common fields"""
    email: EmailStr = Field(nullable=False, unique=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)


class User(UserBase, table=True):
    """User model for the database"""
    __tablename__ = "users"

    # Indexes for efficient querying
    __table_args__ = (
        Index("idx_user_email", "email"),
    )

    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    email: str = Field(nullable=False, unique=True, max_length=255)
    name: Optional[str] = Field(default=None, max_length=255)
    hashed_password: str = Field(nullable=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @classmethod
    def hash_password(cls, password: str) -> str:
        return pwd_context.hash(password)

    def verify_password(self, password: str) -> bool:
        return pwd_context.verify(password, self.hashed_password)


class UserCreate(UserBase):
    """Schema for creating a new user"""
    password: str


class UserRead(UserBase):
    """Schema for reading user data"""
    id: str
    created_at: datetime
    updated_at: datetime


class UserUpdate(SQLModel):
    """Schema for updating user data"""
    name: Optional[str] = None
    email: Optional[str] = None


class UserLogin(SQLModel):
    """Schema for user login"""
    email: EmailStr
    password: str