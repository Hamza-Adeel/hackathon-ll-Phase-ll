---
id: 001
title: Create Initial Project Constitution
stage: constitution
date: 2026-01-28
surface: agent
model: gemini-1.5-pro-001
feature: none
branch: master
user: "N/A"
command: /sp.constitution
labels: ["constitution", "setup"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - ".specify/memory/constitution.md"
tests:
  - "none"
---

## Prompt

/sp.constitution

Project: Full-Stack Multi-User Todo Web Application

Core principles:
- Specification-driven development (no manual coding)
- Security-first architecture (JWT-based authentication & authorization)
- Clear separation of concerns (frontend, backend, auth, data)
- Deterministic, reproducible development outputs
- Production-readiness over demo-only shortcuts

Key standards:
- All features must be traceable to written specifications
- REST API must strictly follow defined endpoints and HTTP semantics
- Authentication must be enforced on every protected route
- User data isolation must be guaranteed at the API and database level
- All generated code must align strictly with the declared tech stack

Technology constraints:
- Frontend: Next.js 16+ (App Router)
- Backend: Python FastAPI
- ORM: SQLModel
- Database: Neon Serverless PostgreSQL
- Authentication: Better Auth (JWT-based)
- No additional frameworks or authentication systems allowed

Security standards:
- All API endpoints require valid JWT authentication
- JWT verification must occur server-side in FastAPI
- Secrets must be sourced from environment variables
- User ID from JWT must match route-level user context
- Unauthorized requests return HTTP 401
- Cross-user data access is strictly forbidden

Development constraints:
- No manual code edits allowed (Claude Code only)
- Development flow must follow:
  Spec → Plan → Tasks → Implementation
- Each phase must be reviewable and auditable
- Backend and frontend must operate as independent services
- Stateless authentication (no backend session storage)

Functional requirements:
- Implement all 5 Basic Level Todo features
- Persistent storage using PostgreSQL
- RESTful CRUD operations for tasks
- Task ownership enforced on every operation
- Responsive, multi-user frontend interface

Quality requirements:
- Code must be readable, modular, and maintainable
- API responses must use consistent schemas
- Proper error handling and HTTP status codes required
- Database migrations must be deterministic
- Environment-based configuration (no hardcoded secrets)

Success criteria:
- All specifications implemented without deviation
- All API endpoints secured and functional
- Users can access only their own tasks
- JWT-based authentication verified end-to-end
- Application runs successfully in a real deployment environment
- Clear evidence of a complete spec-driven development workflow

## Response snapshot

Constitution v1.0.0 has been created and saved to `.specify/memory/constitution.md`. This initial version codifies the project's principles, standards, and technology stack. Key templates were checked for consistency.

- **New Version**: v1.0.0 (Initial ratification)
- **Files for manual follow-up**: None
- **Suggested commit message**: `docs: establish v1.0.0 of project constitution`

## Outcome

- ✅ Impact: High. Establishes foundational rules for the project.
- 🧪 Tests: N/A
- 📁 Files: 1 created/modified.
- 🔁 Next prompts: /sp.specify, /sp.plan
- 🧠 Reflection: The process was smooth. Creating the directories first was a necessary step.

## Evaluation notes (flywheel)

- Failure modes observed: `mkdir -p` is not a valid command in powershell.
- Graders run and results (PASS/FAIL): PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
