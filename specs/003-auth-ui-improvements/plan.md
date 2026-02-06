# Implementation Plan: 003-auth-ui-improvements

**Feature**: `003-auth-ui-improvements`
**Spec**: [spec.md](spec.md)
**Author**: Gemini
**Created**: 2026-02-02
**Status**: DRAFT

## 1. Technical Context

This plan outlines the implementation of a robust JWT-based authentication system and corresponding UI enhancements for the full-stack Todo application.

-   **Backend**: The FastAPI backend will be updated to handle user registration, login, and JWT-based token validation. This involves adding new endpoints and securing existing ones.
-   **Frontend**: The Next.js frontend will be modified to include signup and login forms, manage JWTs (storage and attachment to requests), and implement auth-gated routes and UI elements.
-   **Authentication**: The core of this feature is JWT. The backend will issue tokens, and the frontend will consume them. All communication on protected routes will require a valid JWT.
-   **Database**: No schema changes are anticipated. The existing `User` table will be used for authentication.

## 2. Constitution Check

This plan adheres to the project constitution:

-   **I. Specification-Driven Development**: This plan is derived directly from `spec.md`.
-   **II. Security-First Architecture**: Implements JWT-based auth and enforces it on all protected endpoints as required.
-   **III. Clear Separation of Concerns**: Auth logic is handled in distinct modules in both the frontend and backend.
-   **IV. Deterministic, Reproducible Development Outputs**: All steps are defined to be executed by an agent.
-   **V. Production-Readiness**: Uses stateless JWT authentication.

## 3. Phase 0: Outline & Research

The primary research task is to confirm the libraries for handling JWTs in both the frontend and backend.

-   **Backend (FastAPI)**: The `python-jose` library is a standard choice for working with JWTs in Python. It provides the necessary tools for encoding, decoding, and verifying tokens.
-   **Frontend (Next.js)**: The `jose` library is a modern, zero-dependency library for JWTs that works in various JavaScript environments, including the browser and Edge functions, making it a suitable choice.

A `research.md` file has been generated with these decisions.

## 4. Phase 1: Design & Contracts

### Data Model

No database schema changes are required. The implementation will use the existing `User` model, which includes fields for `email` and `hashed_password`. A `data-model.md` file is generated to document this.

### API Contracts

The following changes will be made to the OpenAPI specification (`contracts/openapi.yaml`):

1.  **New Endpoints**:
    -   `POST /api/v1/users/signup`: For new user registration.
    -   `POST /api/v1/token`: For exchanging username/password for a JWT (login).
2.  **Updated Endpoints**: All existing endpoints for tasks (`/api/v1/tasks/`) will be updated to require bearer token authentication.
3.  **Security Scheme**: A `JWTBearer` security scheme will be defined.

### Quickstart Guide

A `quickstart.md` will be generated to provide instructions on how to use the new authentication system, including how to obtain a token and make authenticated requests.

## 5. Implementation Steps

### Backend (FastAPI)

1.  **Add Dependencies**: Add `python-jose[cryptography]` and `pwdlib` to `pyproject.toml`.
2.  **Configuration**: Add `SECRET_KEY` and `ALGORITHM` to the application configuration (`app/core/config.py`), loaded from environment variables.
3.  **Security Module**: Create a `security.py` module to handle password hashing and JWT creation/decoding.
4.  **Auth Endpoints**:
    -   Implement the `/api/v1/users/signup` endpoint to create new users.
    -   Implement the `POST /api/v1/token` endpoint for users to log in and receive a JWT.
5.  **Dependency for Auth**: Create a dependency (e.g., `get_current_user`) that verifies the JWT from the request header and returns the current user model.
6.  **Secure Task Endpoints**: Add the authentication dependency to all task-related endpoints to ensure only authenticated users can access them.

### Frontend (Next.js)

1.  **Add Dependencies**: Add the `jose` library for token handling.
2.  **UI Components**:
    -   Create `SignupForm.tsx` and `LoginForm.tsx` components.
    -   Create `SignupPage.tsx` and `LoginPage.tsx` pages.
3.  **API Service**:
    -   Add `signup` and `login` functions to `services/api.ts` to call the new backend endpoints.
    -   Modify existing API functions to accept and attach the JWT to request headers.
4.  **State Management (Zustand)**:
    -   Update the store to hold the JWT and the user's authentication status.
    -   Add actions for `login` and `logout`.
5.  **Auth Guarding**:
    -   Implement a higher-order component or a similar mechanism to protect routes that require authentication.
    -   Update `TaskList.tsx` and other components to disable/hide controls based on the user's authentication status.
6.  **UI Feedback**:
    -   Integrate `GlobalSpinner` and `GlobalError` components with the auth flows to provide feedback during API calls.