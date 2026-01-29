# Tasks: Todo Application Backend

**Input**: Design documents from `specs/001-todo-app-backend/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`
- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

## Path Conventions
- All paths are relative to the repository root.

---

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: Project initialization and basic structure.

- [x] T001 Create the directory structure for the backend service inside the `backend/` folder as defined in `plan.md`.
- [x] T002 In the `backend/` directory, initialize a new uv project (`uv init`) and add FastAPI, SQLModel, uvicorn, and other dependencies from `plan.md`.

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [x] T003 [P] Create the configuration loader in `backend/app/core/config.py` to manage environment variables.
- [x] T004 [P] Create a placeholder security module in `backend/app/core/security.py` that will provide a dependency for JWT validation.
- [x] T005 Create the database session manager in `backend/app/db/session.py` to handle database connections.
- [x] T006 Create the `User` and `Task` SQLModels in `backend/app/models/task.py` based on `data-model.md`.
- [x] T007 Create the main FastAPI application in `backend/app/main.py` and configure it to connect to the database on startup.

---

## Phase 3: User Story 1 - Task Creation & Viewing (Priority: P1) 🎯 MVP
**Goal**: Allow users to create tasks and view their list of tasks.
**Independent Test**: A client can POST a new task and then GET the list of tasks and see the new task included.

### Implementation for User Story 1
- [x] T008 [P] [US1] Create the API router for tasks in `backend/app/api/v1/tasks.py`.
- [x] T009 [US1] Implement the `POST /api/v1/tasks/` endpoint in `backend/app/api/v1/tasks.py` for creating tasks.
- [x] T010 [US1] Implement the `GET /api/v1/tasks/` endpoint in `backend/app/api/v1/tasks.py` for listing tasks.
- [x] T011 [US1] Include the tasks router in the main FastAPI app in `backend/app/main.py`.

---

## Phase 4: User Story 2 - Task Modification (Priority: P2)
**Goal**: Allow users to update the title of their tasks.
**Independent Test**: A client can PUT a new title for a task and verify the change is persisted.

### Implementation for User Story 2
- [x] T012 [US2] Implement the `PUT /api/v1/tasks/{task_id}` endpoint in `backend/app/api/v1/tasks.py`.

---

## Phase 5: User Story 3 - Task Completion (Priority: P2)
**Goal**: Allow users to toggle the completion status of their tasks.
**Independent Test**: A client can call the toggle endpoint on a task and verify its `is_completed` status changes.

### Implementation for User Story 3
- [x] T013 [US3] Implement the `PUT /api/v1/tasks/{task_id}/toggle` endpoint in `backend/app/api/v1/tasks.py`.

---

## Phase 6: User Story 4 - Task Deletion (Priority: P3)
**Goal**: Allow users to delete their tasks.
**Independent Test**: A client can DELETE a task and verify it no longer appears in the task list.

### Implementation for User Story 4
- [x] T014 [US4] Implement the `DELETE /api/v1/tasks/{task_id}` endpoint in `backend/app/api/v1/tasks.py`.

---

## Phase N: Polish & Cross-Cutting Concerns
**Purpose**: Improvements that affect multiple user stories.

- [x] T015 [P] Add initial `pytest` tests for the task creation and listing endpoints in `backend/tests/api/v1/test_tasks.py`.
- [x] T016 [P] Add `README.md` to the `backend/` directory explaining how to run the service.

## Dependencies & Execution Order
- **Phase 1** must be completed before **Phase 2**.
- **Phase 2** must be completed before any User Story phases can begin.
- **User Story Phases (3-6)** can technically be implemented in parallel after Phase 2 is complete, but proceeding in priority order (US1 -> US2 -> US3 -> US4) is recommended.
- All tasks within a given User Story phase depend on the previous phases being complete.

## Implementation Strategy
1. **Complete Phase 1 & 2**: Set up the entire project structure and foundational code.
2. **Implement MVP (Phase 3)**: Implement and test User Story 1. At this point, the core value is delivered.
3. **Incremental Delivery**: Add each subsequent user story phase one by one, testing at each step.
