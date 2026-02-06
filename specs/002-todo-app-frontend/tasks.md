# Tasks: Frontend for Todo Web App

**Input**: Design documents from `specs/002-todo-app-frontend/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Paths are relative to the `frontend/` directory.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure.

- [X] T001 Create the initial frontend project structure inside the `frontend` directory using `npx create-next-app@latest`.
- [X] T002 Install necessary dependencies: `zustand`.
- [X] T003 [P] Configure ESLint and Prettier for code quality and consistency.
- [X] T004 [P] Create the directory structure as defined in `plan.md` (app, components, services, lib, types).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented.

- [X] T005 Define the `Task` interface in `src/types/index.ts` based on `data-model.md`.
- [X] T006 Set up the Zustand store in `src/lib/store.ts` for managing client-side state like loading and errors.
- [X] T007 Implement the base API service in `src/services/api.ts` with functions to wrap `fetch` for API calls.
- [X] T008 Create the root layout in `src/app/layout.tsx` with basic HTML structure and global styles.

---

## Phase 3: User Story 1 - View Task List (Priority: P1) 🎯 MVP

**Goal**: Display a list of all tasks for the user.

**Independent Test**: The application loads and displays a list of tasks retrieved from the backend. An empty state is shown if there are no tasks.

### Implementation for User Story 1

- [X] T009 [US1] Implement the `page.tsx` as a Server Component in `src/app/page.tsx` to fetch the initial list of tasks from the backend.
- [X] T010 [P] [US1] Create the `TaskList.tsx` component in `src/components/TaskList.tsx` to render a list of `TaskItem` components.
- [X] T011 [P] [US1] Create the `TaskItem.tsx` component in `src/components/TaskItem.tsx` to display a single task's title and completion status.
- [X] T012 [US1] Integrate `TaskList.tsx` into `src/app/page.tsx` and pass the fetched tasks as props.
- [X] T013 [US1] Implement the empty state UI in `src/app/page.tsx` when no tasks are returned from the API.

---

## Phase 4: User Story 2 - Create a New Task (Priority: P2)

**Goal**: Allow users to add a new task to their list.

**Independent Test**: A user can enter a description for a new task and submit it. The new task then appears in their task list.

### Implementation for User Story 2

- [X] T014 [P] [US2] Create the `AddTaskForm.tsx` component in `src/components/AddTaskForm.tsx` with a text input and a submit button.
- [X] T015 [US2] Add the `createTask` function to the API service in `src/services/api.ts`.
- [X] T016 [US2] Implement the form submission logic in `AddTaskForm.tsx` to call the `createTask` service function.
- [X] T017 [US2] Use `router.refresh()` after a successful creation to update the task list.
- [X] T018 [US2] Integrate the `AddTaskForm.tsx` component into the main page `src/app/page.tsx`.

---

## Phase 5: User Story 3 - Update a Task (Priority: P2)

**Goal**: Allow users to mark a task as complete and edit its description.

**Independent Test**: A user can toggle the completion status of a task and edit its text.

### Implementation for User Story 3

- [X] T019 [US3] Add the `updateTask` function to the API service in `src/services/api.ts`.
- [X] T020 [US3] Implement the logic in `TaskItem.tsx` to handle toggling the completion status. This will involve adding a checkbox and an `onClick` handler that calls the `updateTask` service.
- [X] T021 [US3] Use `router.refresh()` after a successful update to refresh the task list.
- [X] T022 [US3] Implement an inline editing feature for the task title in `TaskItem.tsx`. This will involve changing the title display to an input field on click.

---

## Phase 6: User Story 4 - Delete a Task (Priority: P3)

**Goal**: Allow users to delete a task.

**Independent Test**: A user can delete a task, and it is removed from the list.

### Implementation for User Story 4

- [X] T023 [US4] Add the `deleteTask` function to the API service in `src/services/api.ts`.
- [X] T024 [US4] Add a delete button to the `TaskItem.tsx` component.
- [X] T025 [US4] Implement the logic in `TaskItem.tsx` to call the `deleteTask` service function on button click.
- [X] T026 [US4] Use `router.refresh()` after a successful deletion.
- [X] T027 [US4] Implement a `window.confirm()` dialog before deleting the task.

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories.

- [X] T028 [P] Create a `LoadingSpinner.tsx` component in `src/components/LoadingSpinner.tsx`.
- [X] T029 Implement global loading state management using the Zustand store in `src/lib/store.ts`. Display the spinner when API calls are in progress.
- [X] T030 Implement global error handling. Display user-friendly error messages when API calls fail.
- [X] T031 Review and improve the responsive design for all components on mobile and desktop screens.

---

## Phase 7: UI/UX Refinement

**Purpose**: Improve the visual design and user experience of the application using Tailwind CSS.

- [X] T032 [P] Install and configure Tailwind CSS.
- [X] T033 [P] Style the main page (`src/app/page.tsx`) with a clean layout, title, and background color.
- [X] T034 [P] Refine the styling of the `AddTaskForm.tsx` component for consistency.
- [X] T035 [P] Simplify and improve the styling of the `TaskList.tsx` component.
- [X] T036 [P] Enhance the visual presentation and user experience of the `TaskItem.tsx` component.

---

## Dependencies & Execution Order

- **Setup (Phase 1)** and **Foundational (Phase 2)** must be completed before any user story work begins.
- User stories can be implemented in priority order (US1 -> US2 -> US3 -> US4).
- Within each user story, tasks should be completed in the order they are listed.
- The **Polish** phase can be worked on after all user stories are complete.
- The **UI/UX Refinement** phase can be worked on after all user stories are complete.