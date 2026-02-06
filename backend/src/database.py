"""
Database connection and session management for the Todo Web Application
"""
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool
from sqlmodel import Session, SQLModel
from .config import settings

# Create the database engine
# Use the configured database URL (Neon PostgreSQL), fallback to SQLite only if not available
db_url = settings.DATABASE_URL

engine = create_engine(
    db_url,
    poolclass=QueuePool,
    pool_size=5,
    pool_pre_ping=True,
    pool_recycle=300,
    echo=settings.DEBUG
)


def create_db_and_tables():
    """Create database tables if they don't exist"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Get a database session"""
    session = Session(engine)
    try:
        yield session
    finally:
        session.close()