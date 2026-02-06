# Quickstart: Authentication

**Feature**: `003-auth-ui-improvements`
**Date**: 2026-02-02

This guide provides a quick overview of how to interact with the new authentication system.

## 1. Sign Up

To create a new account, send a `POST` request to the `/api/v1/users/signup` endpoint.

**Request:**

```http
POST /api/v1/users/signup
Host: localhost:8000
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "a_strong_password"
}
```

**Response:**

A successful response will return the newly created user object.

```json
{
  "id": 2,
  "email": "newuser@example.com"
}
```

## 2. Log In (Get a Token)

To log in and get a JWT, send a `POST` request to the `/api/v1/token` endpoint with your credentials in a form-encoded body.

**Request:**

```http
POST /api/v1/token
Host: localhost:8000
Content-Type: application/x-www-form-urlencoded

username=newuser@example.com&password=a_strong_password
```

**Response:**

A successful response will return an access token.

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

## 3. Making Authenticated Requests

To access protected endpoints (like the tasks API), include the `access_token` in the `Authorization` header of your requests with the `Bearer` scheme.

**Request:**

```http
GET /api/v1/tasks/
Host: localhost:8000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**

If the token is valid, you will receive the requested data.

```json
[
  {
    "id": 1,
    "title": "My first task",
    "is_completed": false,
    "owner_id": 2
  }
]
```

If the token is missing, invalid, or expired, you will receive a `401 Unauthorized` error.
