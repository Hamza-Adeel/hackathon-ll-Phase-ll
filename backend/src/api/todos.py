"""
Todos API endpoints for the Todo Web Application - Backend Only
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
from src.database import get_session
from src.models.todo import Todo, TodoBase
from src.services.todo_service import TodoService
from src.middleware import get_current_user_id
from src.schemas.todo import TodoCreate, TodoUpdate, TodoResponse
from src.logging_config import get_logger


logger = get_logger(__name__)
router = APIRouter()


@router.get("/", response_model=List[TodoResponse])
def get_todos(
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get all todos for the current user
    """
    try:
        logger.info(f"Fetching todos for user {current_user_id}")
        todos = TodoService.get_todos_by_user_id(session, current_user_id)
        logger.info(f"Fetched {len(todos)} todos for user {current_user_id}")
        return todos
    except Exception as e:
        logger.error(f"Error fetching todos for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching todos"
        )


@router.post("/", response_model=TodoResponse)
def create_todo(
    todo_data: TodoCreate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Create a new todo for the current user
    """
    try:
        # Validate input data
        if not todo_data.title.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title cannot be empty"
            )

        if len(todo_data.title) > 255:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title must be 255 characters or less"
            )

        if todo_data.description and len(todo_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Description must be 1000 characters or less"
            )

        todo = TodoService.create_todo(
            session=session,
            user_id=current_user_id,
            title=todo_data.title,
            description=todo_data.description,
            priority=todo_data.priority,
            due_date=todo_data.due_date
        )
        return todo
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error creating todo for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while creating the todo"
        )


@router.get("/{todo_id}", response_model=TodoResponse)
def get_todo(
    todo_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Get a specific todo by ID
    """
    try:
        logger.info(f"Fetching todo {todo_id} for user {current_user_id}")
        todo = TodoService.get_todo_by_id(session, todo_id, current_user_id)
        if not todo:
            logger.info(f"Todo {todo_id} not found for user {current_user_id}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found or does not belong to the current user"
            )
        logger.info(f"Successfully fetched todo {todo_id} for user {current_user_id}")
        return todo
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error fetching todo {todo_id} for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching the todo"
        )


@router.put("/{todo_id}", response_model=TodoResponse)
def update_todo(
    todo_id: str,
    todo_data: TodoUpdate,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Update a specific todo by ID
    """
    try:
        # Check if todo exists and belongs to user
        existing_todo = TodoService.get_todo_by_id(session, todo_id, current_user_id)
        if not existing_todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found or does not belong to the current user"
            )

        # Validate input data
        if todo_data.title and not todo_data.title.strip():
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title cannot be empty"
            )

        if todo_data.title and len(todo_data.title) > 255:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Title must be 255 characters or less"
            )

        if todo_data.description and len(todo_data.description) > 1000:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Description must be 1000 characters or less"
            )

        # Update the todo
        updated_todo = TodoService.update_todo(
            session=session,
            todo_id=todo_id,
            user_id=current_user_id,
            **todo_data.dict(exclude_unset=True)
        )

        if not updated_todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found"
            )

        return updated_todo
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error updating todo {todo_id} for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the todo"
        )


@router.delete("/{todo_id}")
def delete_todo(
    todo_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Delete a specific todo by ID
    """
    try:
        success = TodoService.delete_todo(session, todo_id, current_user_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found or does not belong to the current user"
            )
        return {"message": "Todo deleted successfully"}
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error deleting todo {todo_id} for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the todo"
        )


@router.patch("/{todo_id}/toggle-complete", response_model=TodoResponse)
def toggle_todo_complete(
    todo_id: str,
    current_user_id: str = Depends(get_current_user_id),
    session: Session = Depends(get_session)
):
    """
    Toggle the completion status of a specific todo
    """
    try:
        todo = TodoService.toggle_todo_completion(session, todo_id, current_user_id)
        if not todo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Todo not found or does not belong to the current user"
            )
        return todo
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        logger.error(f"Error toggling completion for todo {todo_id} for user {current_user_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while updating the todo completion status"
        )