# Data Model: Todo Application

This document defines the data entities for the Todo application frontend, based on the feature specification.

## Task Entity

Represents a single todo item.

### Fields

| Field Name  | Type    | Description                           | Required |
|-------------|---------|---------------------------------------|----------|
| `id`        | `string`  | A unique identifier for the task.     | Yes      |
| `title`     | `string`  | The description or title of the task. | Yes      |
| `completed` | `boolean` | The completion status of the task.    | Yes      |

### TypeScript Interface

The frontend will use the following TypeScript interface to represent a `Task` object retrieved from the backend API.

```typescript
// in src/types/index.ts

export interface Task {
  id: string;
  title: string;
  completed: boolean;
}
```

### State Transitions

- A `Task` is created with `completed: false`.
- The `completed` status can be toggled between `true` and `false`.
- The `title` can be updated at any time.
- A `Task` can be deleted.
