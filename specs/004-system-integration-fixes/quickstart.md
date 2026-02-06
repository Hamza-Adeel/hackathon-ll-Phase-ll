# Quickstart: System Integration and Error Fixing

This guide explains how to set up and run the full-stack application for testing and validation.

## Prerequisites

- Node.js and npm (for the frontend)
- Python 3.11 and uv (for the backend)
- Access to a Neon Serverless PostgreSQL database

## Backend Setup

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Install dependencies**:
    ```bash
    uv pip install -r requirements.txt
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the `backend` directory and add the following:
    ```
    DATABASE_URL="your_neon_database_url"
    SECRET_KEY="your_secret_key"
    ALGORITHM="HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES=30
    ```

4.  **Run the backend server**:
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend will be running at `http://127.0.0.1:8000`.

## Frontend Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend/my-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the frontend development server**:
    ```bash
    npm run dev
    ```
    The frontend will be running at `http://localhost:3000`.

## Running Tests

### Backend Tests

1.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2.  **Run the tests**:
    ```bash
    pytest
    ```

### Frontend Tests

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend/my-app
    ```

2.  **Run the end-to-end tests**:
    ```bash
    npx playwright test
    ```
