# Environment Setup

**Purpose**: To document the current environment setup for both the frontend and backend of the application. This is based on the information found in `quickstart.md`, `plan.md`, and the project's file structure.

## Backend

-   **Language**: Python 3.11
-   **Package Manager**: uv
-   **Framework**: FastAPI
-   **Database**: Neon Serverless PostgreSQL (via SQLModel)
-   **Testing**: pytest
-   **Dependencies**: Listed in `backend/pyproject.toml` and locked in `backend/uv.lock`.
-   **Environment Configuration**: Managed through a `.env` file in the `backend` directory.
-   **Setup Instructions**: See `quickstart.md`.

## Frontend

-   **Language**: TypeScript
-   **Framework**: Next.js 16+
-   **Package Manager**: npm
-   **Styling**: TailwindCSS
-   **UI Components**: Custom components in `frontend/my-app/src/components`.
-   **Testing**: Playwright/Cypress
-   **Dependencies**: Listed in `frontend/my-app/package.json`.
-   **Environment Configuration**: Next.js handles environment variables.
-   **Setup Instructions**: See `quickstart.md`.

## Overall Architecture

-   The frontend and backend are two separate services.
-   Authentication is handled via JWT.
-   The project is a monorepo with `frontend` and `backend` directories at the root.
