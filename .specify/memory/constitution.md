<!--
Sync Impact Report:
- Version change: Initial Version -> v1.0.0
- List of modified principles:
  - Specification-driven development
  - Security-first architecture
  - Clear separation of concerns
  - Deterministic, reproducible development outputs
  - Production-readiness over demo-only shortcuts
- Added sections:
  - Key standards
  - Technology constraints
  - Security standards
  - Development constraints
  - Functional requirements
  - Quality requirements
  - Success criteria
- Removed sections: None
- Templates requiring updates:
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
- Follow-up TODOs: None
-->
# Full-Stack Multi-User Todo Web Application Constitution

## Core Principles

### I. Specification-Driven Development
No manual coding. All features must be traceable to written specifications. Development flow must follow: Spec -> Plan -> Tasks -> Implementation.

### II. Security-First Architecture
JWT-based authentication & authorization. All API endpoints require valid JWT authentication. Secrets must be sourced from environment variables.

### III. Clear Separation of Concerns
Frontend, backend, auth, and data systems must be distinct. Backend and frontend must operate as independent services.

### IV. Deterministic, Reproducible Development Outputs
No manual code edits allowed (Claude Code only). Each phase must be reviewable and auditable.

### V. Production-Readiness Over Demo-Only Shortcuts
Stateless authentication (no backend session storage). Persistent storage using PostgreSQL.

## Key Standards
- All features must be traceable to written specifications.
- REST API must strictly follow defined endpoints and HTTP semantics.
- Authentication must be enforced on every protected route.
- User data isolation must be guaranteed at the API and database level.
- All generated code must align strictly with the declared tech stack.

## Technology Constraints
- **Frontend**: Next.js 16+ (App Router)
- **Backend**: Python FastAPI
- **ORM**: SQLModel
- **Database**: Neon Serverless PostgreSQL
- **Authentication**: Better Auth (JWT-based)
- No additional frameworks or authentication systems allowed.

## Security Standards
- All API endpoints require valid JWT authentication.
- JWT verification must occur server-side in FastAPI.
- Secrets must be sourced from environment variables.
- User ID from JWT must match route-level user context.
- Unauthorized requests return HTTP 401.
- Cross-user data access is strictly forbidden.

## Development Constraints
- No manual code edits allowed (Claude Code only).
- Development flow must follow: Spec -> Plan -> Tasks -> Implementation.
- Each phase must be reviewable and auditable.
- Backend and frontend must operate as independent services.
- Stateless authentication (no backend session storage).

## Functional Requirements
- Implement all 5 Basic Level Todo features.
- Persistent storage using PostgreSQL.
- RESTful CRUD operations for tasks.
- Task ownership enforced on every operation.
- Responsive, multi-user frontend interface.

## Quality Requirements
- Code must be readable, modular, and maintainable.
- API responses must use consistent schemas.
- Proper error handling and HTTP status codes required.
- Database migrations must be deterministic.
- Environment-based configuration (no hardcoded secrets).

## Success Criteria
- All specifications implemented without deviation.
- All API endpoints secured and functional.
- Users can access only their own tasks.
- JWT-based authentication verified end-to-end.
- Application runs successfully in a real deployment environment.
- Clear evidence of a complete spec-driven development workflow.

## Governance

This Constitution is the single source of truth for project principles and standards. All development activities, reviews, and artifacts must comply with its rules. Amendments require documented approval and a clear migration plan for existing components.

**Version**: v1.0.0 | **Ratified**: 2026-01-28 | **Last Amended**: 2026-01-28