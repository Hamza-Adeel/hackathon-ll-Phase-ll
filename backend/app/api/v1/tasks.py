from typing import List

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlmodel import Session, select

from app.db.session import get_session
from app.models.pydantic_models import TaskCreate, TaskUpdate
from app.models.task import Task, User

router = APIRouter()


@router.post("/", response_model=Task)
def create_task(*, session: Session = Depends(get_session), task_in: TaskCreate):
    # Temporary: get or create user
    user = session.get(User, 1)
    if not user:
        user = User(id=1, email="user@example.com", hashed_password="password")
        session.add(user)
        session.commit()
        session.refresh(user)

    db_task = Task.from_orm(task_in, update={"owner_id": user.id})
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.get("/", response_model=List[Task])
def read_tasks(
    *,
    session: Session = Depends(get_session),
):
    # Temporary: get user
    user = session.get(User, 1)
    if not user:
        # In a real app, you'd handle this as an error.
        # For now, we'll return an empty list if the user doesn't exist.
        return []
    tasks = session.exec(select(Task).where(Task.owner_id == user.id)).all()
    return tasks


@router.put("/{task_id}", response_model=Task)
def update_task(
    *,
    session: Session = Depends(get_session),
    task_id: int,
    task_in: TaskUpdate,
):
    # Temporary: get user
    user = session.get(User, 1)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_task = session.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == user.id)
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    task_data = task_in.dict(exclude_unset=True)
    for key, value in task_data.items():
        setattr(db_task, key, value)

    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.put("/{task_id}/toggle", response_model=Task)
def toggle_task(
    *,
    session: Session = Depends(get_session),
    task_id: int,
):
    # Temporary: get user
    user = session.get(User, 1)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_task = session.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == user.id)
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_task.is_completed = not db_task.is_completed
    session.add(db_task)
    session.commit()
    session.refresh(db_task)
    return db_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    *,
    session: Session = Depends(get_session),
    task_id: int,
):
    # Temporary: get user
    user = session.get(User, 1)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db_task = session.exec(
        select(Task).where(Task.id == task_id, Task.owner_id == user.id)
    ).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(db_task)
    session.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
