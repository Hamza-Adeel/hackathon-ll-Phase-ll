# Todo Application Backend

This directory contains the backend service for a multi-user todo application, built with FastAPI and SQLModel.

## Prerequisites

- Python 3.11+
- uv (for dependency management)
- A running PostgreSQL instance

## 1. Setup Environment

Clone the repository and navigate to the `backend` directory.

Create a `.env` file in this directory with the following content, replacing the placeholder with your actual PostgreSQL connection string:

```
DATABASE_URL="postgresql://user:password@host:port/database"
SECRET_KEY="your-super-secret-key-for-jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 2. Install Dependencies

Install the required Python packages using `uv`:

```bash
uv pip install -r requirements.txt
```
*Note: a `requirements.txt` will be generated from `pyproject.toml` in a later step.*

## 3. Run the Application

Use `uvicorn` to run the FastAPI application:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## 4. API Documentation

Once the application is running, the interactive OpenAPI documentation (Swagger UI) will be available at `http://12art.of.code.something.com:8000/docs`.
