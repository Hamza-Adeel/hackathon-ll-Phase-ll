/**
 * Utility functions to transform data between backend and frontend formats
 */

import { Task, User } from '../types';

/**
 * Transforms backend todo response to frontend Task type
 */
export const transformTodoToTask = (todo: any): Task => {
  return {
    id: todo.id,
    title: todo.title,
    description: todo.description,
    completed: todo.completed,
    userId: todo.user_id, // Map backend's user_id to frontend's userId
    createdAt: todo.created_at,
    updatedAt: todo.updated_at,
    priority: todo.priority || 'medium', // Default priority if not provided
    dueDate: todo.due_date || todo.dueDate, // Handle different possible field names
  };
};

/**
 * Transforms backend user response to frontend User type
 */
export const transformUserToUserType = (user: any): User => {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.created_at,
    updatedAt: user.updated_at,
  };
};

/**
 * Transforms an array of backend todos to frontend Task types
 */
export const transformTodosToTasks = (todos: any[]): Task[] => {
  return todos.map(transformTodoToTask);
};