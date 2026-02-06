"""
Todo model for the Todo Web Application - Backend Only
"""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel
from sqlalchemy import Index
import uuid


class TodoBase(SQLModel):
    """Base model for Todo with common fields"""
    title: str = Field(nullable=False, max_length=255)
    description: Optional[str] = Field(default=None, max_length=1000)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium", max_length=20)  # low, medium, high
    due_date: Optional[str] = Field(default=None, max_length=20)  # ISO date string


class Todo(TodoBase, table=True):
    """Todo model for the database"""
    __tablename__ = "todos"

    # Indexes for efficient querying
    __table_args__ = (
        Index("idx_todo_user_id", "user_id"),
        Index("idx_todo_completed", "completed"),
        Index("idx_todo_created_at", "created_at"),
        Index("idx_todo_user_completed", "user_id", "completed"),
    )

    id: Optional[str] = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(nullable=False)  # Store user_id as string from JWT
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)