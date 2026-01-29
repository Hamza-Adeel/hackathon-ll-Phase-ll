from typing import List, Optional

from sqlmodel import Field, Relationship, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str

    tasks: List["Task"] = Relationship(back_populates="owner")


class Task(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    is_completed: bool = False
    owner_id: int = Field(foreign_key="user.id")

    owner: User = Relationship(back_populates="tasks")
