"""
Configuration settings for the Todo Web Application
"""
import os
from typing import Optional
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Database settings
    DATABASE_URL: str = os.getenv("DATABASE_URL")

    # JWT settings
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "10080"))  # 7 days (7 * 24 * 60 = 10080 minutes)

    # Application settings
    APP_NAME: str = "Todo Web Application"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    class Config:
        env_file = ".env"
        env_file_encoding = 'utf-8'


# Create a single instance of settings
settings = Settings()