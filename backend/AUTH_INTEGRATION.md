# Better Auth Integration Guide

## Overview
This document describes how to integrate Better Auth with the existing JWT-based authentication system in the backend.

## Token Compatibility
The backend is configured to work seamlessly with Better Auth-generated JWT tokens by ensuring:
- Same JWT algorithm (HS256)
- Same secret key (configured in `JWT_SECRET_KEY`)
- Compatible token payload structure (user_id in `sub` claim)

## Configuration Requirements

### Backend Configuration
The backend is already configured with:
- `JWT_SECRET_KEY`: Secret key for signing/verifying tokens
- `JWT_ALGORITHM`: Algorithm set to HS256 (compatible with Better Auth)
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Set to 10080 minutes (7 days) to match Better Auth

### Frontend Configuration (Better Auth)
Configure Better Auth with the same settings:
```javascript
import { betterAuth } from "better-auth";

export const auth = betterAuth({
  secret: process.env.JWT_SECRET_KEY || "your-secret-key-change-in-production",
  // Other configuration...
});
```

## API Endpoints

### Authentication Endpoints
- `POST /api/v1/auth/refresh-token` - Refresh existing token
- `GET /api/v1/auth/validate-token` - Validate existing token

### Todo Endpoints (Protected)
All these endpoints require a valid JWT token in the Authorization header:
- `GET /api/v1/todos/` - Get user's todos
- `POST /api/v1/todos/` - Create new todo
- `GET /api/v1/todos/{id}` - Get specific todo
- `PUT /api/v1/todos/{id}` - Update specific todo
- `DELETE /api/v1/todos/{id}` - Delete specific todo
- `PATCH /api/v1/todos/{id}/toggle-complete` - Toggle completion status

## Token Format
Tokens should contain the following claims:
- `sub`: User's unique identifier (will be used as user_id)
- `exp`: Expiration timestamp
- Other standard JWT claims as needed

## Security Considerations
- Store the JWT secret securely (preferably in environment variables)
- Use HTTPS in production to prevent token interception
- Tokens expire after 7 days to balance usability and security
- All endpoints validate user ownership of resources

## Error Handling
- `401 Unauthorized`: Invalid or expired token
- `403 Forbidden`: Insufficient permissions (though not heavily used in this app)
- `404 Not Found`: Resource not found or doesn't belong to user