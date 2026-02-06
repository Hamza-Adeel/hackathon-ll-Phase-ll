# Quickstart: Frontend Todo App

This guide explains how to set up and run the frontend for the Todo web application.

## Prerequisites

-   Node.js (v18 or later)
-   npm, yarn, or pnpm

## Setup

1.  **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    # yarn install
    # or
    # pnpm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the `frontend` directory. Add the URL for the backend API:
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    ```
    Replace the URL if the backend is running on a different address.

## Running the Application

1.  **Start the development server**:
    ```bash
    npm run dev
    # or
    # yarn dev
    # or
    # pnpm dev
    ```

2.  **Open the application**:
    Open your browser and navigate to `http://localhost:3000`.

## Building for Production

To create a production-ready build of the application, run:

```bash
npm run build
```

The output will be in the `.next` directory.
