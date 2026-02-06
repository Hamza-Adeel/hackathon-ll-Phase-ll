# Research: Frontend Technology Decisions

This document outlines the research and decisions made for the frontend implementation of the Todo Web App.

## 1. Data Fetching in Next.js App Router

### Research Task
"Research data fetching patterns in Next.js App Router (Server Components, Client Components, Route Handlers)."

### Findings
The Next.js App Router introduces a new paradigm with React Server Components (RSCs) being the default.

-   **React Server Components (RSCs)**: These components run on the server and can fetch data directly, even using `async/await`. This is the recommended approach for initial page loads as it reduces the amount of JavaScript sent to the client and moves data fetching closer to the data source.
-   **Client Components**: These are the traditional React components that run in the browser. They can fetch data using `useEffect` with `fetch`, or use libraries like SWR or React Query. They are necessary for handling user interactions and client-side state.
-   **Route Handlers**: These are used to create API endpoints within the Next.js application. While powerful, they are not the primary mechanism for fetching data for UI rendering in the App Router model. They are more suited for handling API requests from client components (e.g., form submissions).

### Decision
-   **Initial Data Fetching**: We will use React Server Components to fetch the initial list of tasks. The main page (`app/page.tsx`) will be a Server Component that `await`s the result of fetching the task list from the backend API.
-   **Data Mutations (Create, Update, Delete)**: These actions will be triggered from Client Components. We will use the standard `fetch` API within client-side event handlers to call the backend API endpoints. To re-validate the data shown by the Server Component, we will use the `router.refresh()` method from `next/navigation`, which re-fetches data for the current route without a full page reload.

### Rationale
This approach aligns with the recommended patterns for the Next.js App Router. It leverages the performance benefits of Server Components for the initial load while providing a clean and simple way to handle client-side mutations. Using `router.refresh()` is a lightweight way to keep the server-rendered data fresh after a mutation.

## 2. State Management

### Research Task
"Research state management libraries compatible with Next.js App Router (e.g., Zustand, Jotai, Redux Toolkit, React Context)."

### Findings
-   **React Context**: Good for simple state that doesn't change often, but can cause performance issues with frequent updates due to re-rendering consumers.
-   **Redux Toolkit**: A robust and predictable state container, but can be verbose for simple applications. Requires more boilerplate code.
-   **Jotai**: A minimalistic, atom-based state management library. It is very flexible and scales well.
-   **Zustand**: A small, fast, and scalable state management solution. It's known for its simplicity and minimal boilerplate. It works well with the Next.js App Router model.

### Decision
We will use **Zustand** for client-side state management.

### Rationale
Zustand provides the right balance of simplicity, performance, and power for this application. It's very easy to set up and use, requires minimal boilerplate, and is well-suited for managing the client-side state we need, such as loading states, error messages, and potentially the state of the "add task" form input. It avoids the re-rendering issues of Context and the verbosity of Redux for a project of this scale.
