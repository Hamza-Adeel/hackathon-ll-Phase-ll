# Research: Todo Application Backend

**Purpose**: To confirm the technology stack and design patterns for the backend implementation, based on the project constitution.

## 1. Backend Framework
- **Decision**: FastAPI
- **Rationale**: This is mandated by the project constitution under "Technology Constraints". FastAPI is a modern, high-performance web framework for building APIs with Python, which aligns with the project's performance goals. Its use of Python type hints for data validation and OpenAPI generation is also a major advantage.
- **Alternatives considered**: Flask, Django. Rejected as they are not permitted by the constitution.

## 2. Database and ORM
- **Decision**: PostgreSQL with SQLModel
- **Rationale**: The constitution specifies "Neon Serverless PostgreSQL" as the database and "SQLModel" as the ORM. SQLModel is built on top of Pydantic and SQLAlchemy, providing a simple and intuitive way to define, validate, and interact with database models using standard Python type annotations.
- **Alternatives considered**: SQLAlchemy Core, Tortoise ORM. Rejected as they are not the specified ORM.

## 3. Authentication
- **Decision**: JWT-based authentication placeholders.
- **Rationale**: The constitution mandates "Better Auth (JWT-based)". The implementation will include placeholder functions for JWT validation as a dependency in API endpoints to ensure the API is designed for security from the start, even though the full implementation is deferred.
- **Alternatives considered**: Session-based authentication. Rejected as the constitution specifies "Stateless authentication (no backend session storage)".
