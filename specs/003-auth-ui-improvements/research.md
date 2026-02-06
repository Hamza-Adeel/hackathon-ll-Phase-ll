# Research: Authentication Libraries

**Feature**: `003-auth-ui-improvements`
**Date**: 2026-02-02

## Decision: Authentication Libraries

For the implementation of JWT-based authentication and password hashing, the following libraries have been selected.

### Backend (FastAPI)

-   **JWT Library**: `python-jose`
-   **Rationale**: `python-jose` is a widely-used and robust library for encoding, decoding, and verifying JWTs in Python. It integrates well with FastAPI and provides the necessary cryptographic features. It is a well-maintained and trusted choice for JWT handling in the Python ecosystem.
-   **Password Hashing Library**: `pwdlib`
-   **Rationale**: `pwdlib` is a modern password hashing library for Python that supports algorithms like Argon2. It is designed to be a replacement for the unmaintained `passlib` library and is compatible with modern Python versions like 3.13.
-   **Alternatives considered**: 
    -   `PyJWT` is another popular option for JWT. However, `python-jose` offers a slightly broader feature set.
    -   `passlib` was considered for password hashing, but it is no longer actively maintained and has compatibility issues with Python 3.13+.

### Frontend (Next.js)

-   **Library**: `jose`
-   **Rationale**: `jose` is a modern, lightweight, and zero-dependency library for JWT and other JOSE standards. Its isomorphic nature (working in both Node.js and browser environments) makes it a perfect fit for Next.js applications, which can involve server-side and client-side rendering.
-   **Alternatives considered**: `jsonwebtoken` is a very popular library, but it is primarily designed for Node.js. `jwt-decode` is useful for decoding but doesn't handle verification, which might be needed on the client side in some scenarios. `jose` provides a complete solution.
