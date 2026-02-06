# Data Models: Todo Application Backend

**Purpose**: To define the database schema for the entities required by the feature specification. These models will be implemented using SQLModel.

## E-R Diagram (Logical)
```
+---------+          +---------+
|  User   |          |  Task   |
+---------+          +---------+
| id (PK) | ∞------< | id (PK) |
| email   |          | title   |
| password|          | is_done |
+---------+          | owner_id|
                     +---------+
```

## Table: `users`
Represents a user of the application.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `integer` | Primary Key, Auto-incrementing | Unique identifier for the user. |
| `email` | `varchar` | Not Null, Unique | User's email address, used for login. |
| `hashed_password` | `varchar` | Not Null | Hashed password for the user. |

*Note: The `users` table will be fully implemented in a later feature dedicated to authentication. For this feature, we only need to know it exists as a reference for task ownership.*

## Table: `tasks`
Represents a single todo item.

| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `integer` | Primary Key, Auto-incrementing | Unique identifier for the task. |
| `title` | `varchar` | Not Null | The content of the todo item. |
| `is_completed` | `boolean` | Not Null, Default: `false` | The completion status of the task. |
| `owner_id` | `integer` | Not Null, Foreign Key (`users.id`) | The ID of the user who owns the task. |
