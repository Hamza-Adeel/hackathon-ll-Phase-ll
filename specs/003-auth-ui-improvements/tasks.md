# Tasks: Authentication & UI Improvements

**Input**: Design documents from `/specs/003-auth-ui-improvements/`
**Prerequisites**: plan.md, spec.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add all necessary dependencies to the backend and frontend projects.

- [X] T001 [P] Add `python-jose[cryptography]` and `pwdlib` to backend `pyproject.toml`
- [X] T002 [P] Add `jose` library to frontend `package.json`

---

## Phase 2: Foundational (Backend Auth)

**Purpose**: Implement the core, non-endpoint-specific authentication infrastructure in the backend.

**⚠️ CRITICAL**: This is a prerequisite for all other backend and frontend auth tasks.

- [X] T003 Add `SECRET_KEY` and `ACCESS_TOKEN_EXPIRE_MINUTES` to `app/core/config.py`, loaded from environment variables.
- [X] T004 Create `app/core/security.py` to handle password hashing, JWT creation, and JWT decoding.
- [X] T005 Create a reusable FastAPI dependency in `app/api/v1/dependencies.py` to get the current user from a JWT.

---

## Phase 3: User Story 1 & 2 - New User Registration & Login (Backend) 🎯 MVP

**Goal**: Create the backend endpoints for user registration and login.

**Independent Test**: The `/api/v1/users/signup` and `/api/v1/token` endpoints can be tested independently using an API client as described in `quickstart.md`.

### Implementation for User Story 1 & 2 (Backend)

- [X] T006 [US1] Implement the `POST /api/v1/users/signup` endpoint in `app/api/v1/users.py` to create new user accounts.
- [X] T007 [US2] Implement the `POST /api/v1/token` endpoint in `app/api/v1/token.py` to handle user login and issue JWTs.
- [X] T008 [US2] Secure all existing task endpoints in `app/api/v1/tasks.py` by adding the `get_current_user` dependency created in T005.

**Checkpoint**: Backend is now capable of registering users, issuing tokens, and protecting task endpoints.

---

## Phase 4: User Story 1 & 2 - New User Registration & Login (Frontend) 🎯 MVP

**Goal**: Create the frontend UI and logic for user registration and login.

**Independent Test**: A user can visit the site, see login/signup options, create an account, log in, and receive a token that is stored in the application state.

### Implementation for User Story 1 & 2 (Frontend)

- [X] T009 [P] [US1] Create a `SignupForm.tsx` component in `frontend/my-app/src/components/`.
- [X] T010 [P] [US2] Create a `LoginForm.tsx` component in `frontend/my-app/src/components/`.
- [X] T011 [P] [US1] Create a `signup` page in `frontend/my-app/src/app/signup/page.tsx` that uses the `SignupForm` component.
- [X] T012 [P] [US2] Create a `login` page in `frontend/my-app/src/app/login/page.tsx` that uses the `LoginForm` component.
- [X] T013 [US1, US2] Update the API service in `frontend/my-app/src/services/api.ts` to include `signup` and `login` functions.
- [X] T014 [US1, US2] Update the Zustand store in `frontend/my-app/src/lib/store.ts` to manage the JWT and user authentication state (`isAuthenticated`).
- [X] T015 [US1, US2] Modify the API service in `frontend/my-app/src/services/api.ts` to attach the stored JWT to all authenticated requests.

**Checkpoint**: Frontend now has functional signup and login forms and manages authentication state.

---

## Phase 5: User Story 3 - Enhanced User Experience

**Goal**: Improve the user experience by reflecting the user's authentication state in the UI.

**Independent Test**: An unauthenticated user sees disabled buttons and is redirected from protected pages. A logged-in user sees enabled buttons and can access protected pages. Loading and error states are clearly communicated.

### Implementation for User Story 3

- [X] T016 [US3] Implement a higher-order component or middleware in the frontend to create auth-gated routes, redirecting unauthenticated users from protected pages.
- [X] T017 [US3] Update `frontend/my-app/src/components/TaskList.tsx` and `AddTaskForm.tsx` to disable actions/buttons if the user is not authenticated.
- [X] T018 [US3] Integrate `GlobalSpinner.tsx` into the `login` and `signup` pages to show loading states during API calls.
- [X] T019 [US3] Integrate `GlobalError.tsx` to display clear error messages for authentication failures (e.g., wrong password, user exists).

**Checkpoint**: The UI now dynamically adapts to the user's authentication status, providing a better user experience.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and cleanup.

- [X] T020 Run through the `quickstart.md` guide to manually validate the entire authentication flow end-to-end.
- [X] T021 Review all code for consistency and adherence to the project constitution.

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** can be done immediately.
- **Phase 2 (Foundational Backend)** depends on Phase 1.
- **Phase 3 (Backend Endpoints)** depends on Phase 2.
- **Phase 4 (Frontend Auth Logic)** depends on Phase 3. The backend endpoints must exist before the frontend can be fully implemented.
- **Phase 5 (UI Polish)** depends on Phase 4.
- **User Story 1 & 2 tasks** are grouped as they form the core authentication MVP.
- **User Story 3 tasks** build upon the completed MVP.
