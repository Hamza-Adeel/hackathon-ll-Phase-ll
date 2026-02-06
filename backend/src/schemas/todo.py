"""
Todo schemas for the Todo Web Application - Backend Only
"""
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TodoBase(BaseModel):
    """Base schema for Todo"""
    title: str
    description: Optional[str] = None
    completed: bool = False
    priority: str = "medium"
    due_date: Optional[str] = None


class TodoCreate(TodoBase):
    """Schema for creating a new Todo"""
    title: str
    priority: str = "medium"
    due_date: Optional[str] = None


class TodoUpdate(BaseModel):
    """Schema for updating a Todo"""
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None


class TodoResponse(TodoBase):
    """Schema for Todo response"""
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True