"""
Todo service for the Todo Web Application - Backend Only
"""
from typing import List, Optional
from sqlmodel import Session, select
from ..models.todo import Todo
from ..logging_config import get_logger


logger = get_logger(__name__)


class TodoService:
    """Service class for handling todo operations"""

    @staticmethod
    def get_todos_by_user_id(session: Session, user_id: str) -> List[Todo]:
        """
        Get all todos for a specific user

        Args:
            session: Database session
            user_id: User's ID (as string from JWT)

        Returns:
            List of Todo objects
        """
        statement = select(Todo).where(Todo.user_id == user_id).order_by(Todo.created_at.desc())
        return session.exec(statement).all()

    @staticmethod
    def get_todo_by_id(session: Session, todo_id: str, user_id: str) -> Optional[Todo]:
        """
        Get a specific todo by ID for a specific user

        Args:
            session: Database session
            todo_id: Todo's ID
            user_id: User's ID (as string from JWT)

        Returns:
            Todo object if found and belongs to user, None otherwise
        """
        statement = select(Todo).where(Todo.id == todo_id, Todo.user_id == user_id)
        return session.exec(statement).first()

    @staticmethod
    def create_todo(session: Session, user_id: str, title: str, description: Optional[str] = None, priority: str = "medium", due_date: Optional[str] = None) -> Todo:
        """
        Create a new todo for a user

        Args:
            session: Database session
            user_id: User's ID (as string from JWT)
            title: Todo title
            description: Optional description
            priority: Priority level (default: "medium")
            due_date: Due date in ISO format (optional)

        Returns:
            Created Todo object
        """
        try:
            todo = Todo(title=title, description=description, priority=priority, due_date=due_date, user_id=user_id)
            session.add(todo)
            session.commit()
            session.refresh(todo)
            logger.info(f"Todo created with id: {todo.id} for user: {user_id}")
            return todo
        except Exception as e:
            session.rollback()
            logger.error(f"Error creating todo for user {user_id}: {str(e)}")
            raise e

    @staticmethod
    def update_todo(session: Session, todo_id: str, user_id: str, **kwargs) -> Optional[Todo]:
        """
        Update a todo for a user

        Args:
            session: Database session
            todo_id: Todo's ID
            user_id: User's ID (as string from JWT)
            **kwargs: Fields to update

        Returns:
            Updated Todo object if found and belongs to user, None otherwise
        """
        try:
            todo = TodoService.get_todo_by_id(session, todo_id, user_id)
            if todo:
                for key, value in kwargs.items():
                    setattr(todo, key, value)
                session.add(todo)
                session.commit()
                session.refresh(todo)
                logger.info(f"Todo updated with id: {todo_id} for user: {user_id}")
            return todo
        except Exception as e:
            session.rollback()
            logger.error(f"Error updating todo {todo_id} for user {user_id}: {str(e)}")
            raise e

    @staticmethod
    def delete_todo(session: Session, todo_id: str, user_id: str) -> bool:
        """
        Delete a todo for a user

        Args:
            session: Database session
            todo_id: Todo's ID
            user_id: User's ID (as string from JWT)

        Returns:
            True if todo was deleted, False if not found or doesn't belong to user
        """
        try:
            todo = TodoService.get_todo_by_id(session, todo_id, user_id)
            if todo:
                session.delete(todo)
                session.commit()
                logger.info(f"Todo deleted with id: {todo_id} for user: {user_id}")
                return True
            return False
        except Exception as e:
            session.rollback()
            logger.error(f"Error deleting todo {todo_id} for user {user_id}: {str(e)}")
            raise e

    @staticmethod
    def toggle_todo_completion(session: Session, todo_id: str, user_id: str) -> Optional[Todo]:
        """
        Toggle the completion status of a todo

        Args:
            session: Database session
            todo_id: Todo's ID
            user_id: User's ID (as string from JWT)

        Returns:
            Updated Todo object if found and belongs to user, None otherwise
        """
        try:
            todo = TodoService.get_todo_by_id(session, todo_id, user_id)
            if todo:
                todo.completed = not todo.completed
                session.add(todo)
                session.commit()
                session.refresh(todo)
                logger.info(f"Todo completion toggled for id: {todo_id} for user: {user_id}")
            return todo
        except Exception as e:
            session.rollback()
            logger.error(f"Error toggling completion for todo {todo_id} for user {user_id}: {str(e)}")
            raise e