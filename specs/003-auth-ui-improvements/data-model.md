# Data Model: User

**Feature**: `003-auth-ui-improvements`
**Date**: 2026-02-02

## No Schema Changes

As per the specification, no changes are required to the existing database schema. The authentication system will leverage the existing `User` table and its corresponding `User` model in the backend.

## Existing User Model

The following model is already defined in the backend and will be used for user authentication and data isolation.

### User

-   **Description**: Represents a user of the application.
-   **Fields**:
    -   `id` (Integer, Primary Key): The unique identifier for the user.
    -   `email` (String, Unique): The user's email address, used as their username for login.
    -   `hashed_password` (String): The user's hashed password for secure storage.
-   **Relationships**:
    -   A user has a one-to-many relationship with tasks. This is already defined and enforced.
