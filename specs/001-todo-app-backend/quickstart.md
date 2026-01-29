# Quickstart: Todo Application Backend

**Purpose**: To provide instructions for setting up and running the backend service locally for development and testing.

## Prerequisites
- Python 3.11+
- Poetry (for dependency management)
- A running PostgreSQL instance

## 1. Setup Environment
Clone the repository and navigate to the `backend` directory.

Create a `.env` file in the `backend` directory with the following content, replacing the placeholder with your actual PostgreSQL connection string:
```
DATABASE_URL="postgresql://user:password@host:port/database"
SECRET_KEY="your-super-secret-key-for-jwt"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## 2. Install Dependencies
Install the required Python packages using Poetry:
```bash
cd backend
poetry install
```

## 3. Run Database Migrations
*Note: The migration generation and execution mechanism will be defined in the implementation phase.*

For now, you can manually create the tables based on the `data-model.md` specification.

## 4. Run the Application
Use `uvicorn` to run the FastAPI application:
```bash
poetry run uvicorn app.main:app --reload
```
The API will be available at `http://127.0.0.1:8000`.

## 5. API Documentation
Once the application is running, the interactive OpenAPI documentation (Swagger UI) will be available at `http://127.0.0.1:8000/docs`.
