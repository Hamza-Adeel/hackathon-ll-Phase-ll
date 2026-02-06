"""
Logging configuration for the Todo Web Application
"""
import logging
import sys
from datetime import datetime
from typing import Dict, Any
from logging.handlers import RotatingFileHandler


def setup_logging(debug: bool = False) -> None:
    """Configure logging for the application"""

    # Remove all existing handlers
    for handler in logging.root.handlers[:]:
        logging.root.removeHandler(handler)

    # Set logging level
    logging_level = logging.DEBUG if debug else logging.INFO
    logging.basicConfig(
        level=logging_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(sys.stdout),
            RotatingFileHandler('app.log', maxBytes=10000000, backupCount=5)
        ]
    )


def get_logger(name: str) -> logging.Logger:
    """Get a logger with the specified name"""
    return logging.getLogger(name)


# Custom exception classes
class TodoException(Exception):
    """Base exception for todo application"""
    def __init__(self, message: str, status_code: int = 500):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationException(TodoException):
    """Exception for authentication errors"""
    def __init__(self, message: str = "Authentication failed"):
        super().__init__(message, 401)


class AuthorizationException(TodoException):
    """Exception for authorization errors"""
    def __init__(self, message: str = "Authorization failed"):
        super().__init__(message, 403)


class ResourceNotFoundException(TodoException):
    """Exception for resource not found errors"""
    def __init__(self, message: str = "Resource not found"):
        super().__init__(message, 404)


class ValidationError(TodoException):
    """Exception for validation errors"""
    def __init__(self, message: str = "Validation error"):
        super().__init__(message, 422)