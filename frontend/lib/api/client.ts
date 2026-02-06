import { ErrorResponse, Task } from '../types';
import {
  transformTodoToTask,
  transformTodosToTasks,
  transformUserToUserType,
} from '../utils/data-transformer';
import { toast } from 'sonner';

class ApiClient {
  private baseUrl: string;
  private token: string | null;

  constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    this.token = null;
  }

  setToken(token: string) {
    this.token = token;
  }

  removeToken() {
    this.token = null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        const error: ErrorResponse = {
          error: 'Unauthorized',
          code: 'AUTH_REQUIRED',
        };
        toast.error('Session expired. Please log in again.');
        this.removeToken();
        // Optionally redirect to login page
        // window.location.href = '/auth/login';
        throw error;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        // Handle specific error messages with user-friendly notifications
        let errorMessage = 'An error occurred';
        if (errorData.detail) {
          errorMessage = typeof errorData.detail === 'string'
            ? errorData.detail
            : (Array.isArray(errorData.detail) ? errorData.detail[0]?.msg || 'Validation error' : 'Request failed');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }

        toast.error(errorMessage);
        throw { ...errorData, message: errorMessage };
      }

      const result = await response.json();

      // Show success notifications for certain operations
      if (options.method === 'POST' && endpoint.includes('/auth/signup')) {
        toast.success('Account created successfully!');
      } else if (options.method === 'POST' && endpoint.includes('/auth/login')) {
        toast.success('Logged in successfully!');
      } else if (options.method === 'DELETE' && endpoint.includes('/todos')) {
        toast.success('Task deleted successfully!');
      } else if (options.method === 'PUT' && endpoint.includes('/todos')) {
        toast.success('Task updated successfully!');
      } else if (options.method === 'POST' && endpoint.includes('/todos')) {
        toast.success('Task created successfully!');
      }

      return result;
    } catch (error) {
      console.error(`API request failed: ${url}`, error);

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        toast.error('Network error. Please check your connection and try again.');
        throw new Error('Network error: Unable to connect to the server');
      }

      // Don't re-throw the error if it was already handled with toast
      throw error;
    }
  }

  // =========================
  // AUTHENTICATION
  // =========================

  async signup(userData: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await this.request<{
        access_token?: string;
        token?: string;
        expires_in?: number;
        user?: any;
      }>('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      const token = response.access_token || response.token;

      // 🔐 token set karo
      if (token) {
        this.setToken(token);
      }

      // Return the user data directly from the response instead of making an extra call
      return {
        user: response.user ? transformUserToUserType(response.user) : null,
        token,
        expiresIn: response.expires_in,
      };
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  }

  async login(credentials: { email: string; password: string }) {
    try {
      const response = await this.request<{ access_token?: string; token?: string; expires_in?: number }>('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });

      const token = response.access_token || response.token;

      if (token) {
        this.setToken(token);
      }

      const me = await this.getCurrentUser();

      return {
        user: me.user,
        token,
        expiresIn: response.expires_in,
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    this.removeToken();
    const result = await this.request('/api/v1/auth/logout', {
      method: 'POST',
    });

    toast.success('Logged out successfully!');
    return result;
  }

  async getCurrentUser() {
    const response= await this.request('/api/v1/auth/me');

    return {
      user: transformUserToUserType(response),
    };
  }

  // =========================
  // TASKS
  // =========================

  async getTasks(params?: {
    page?: number;
    limit?: number;
    filter?: string;
    sort?: string;
  }) {
    const queryParams = new URLSearchParams();

    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.filter) queryParams.append('filter', params.filter);
    if (params?.sort) queryParams.append('sort', params.sort);

    const queryString = queryParams.toString();
    const endpoint = `/api/v1/todos/${queryString ? `?${queryString}` : ''}`;

    const response= await this.request(endpoint);

    return Array.isArray(response)
      ? transformTodosToTasks(response)
      : [];
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    priority?: string;
    dueDate?: string;
  }) {
    const response = await this.request('/api/v1/todos/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });

    return transformTodoToTask(response);
  }

  async getTaskById(id: string) {
    const response = await this.request<Task>(`/api/v1/todos/${id}`);
    return transformTodoToTask(response);
  }

  async updateTask(
    id: string,
    taskData: Partial<{
      title: string;
      description?: string;
      completed?: boolean;
      priority?: string;
      dueDate?: string;
    }>
  ) {
    const response = await this.request(`/api/v1/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });

    return transformTodoToTask(response);
  }

  async toggleTaskCompletion(id: string) {
    const response = await this.request(
      `/api/v1/todos/${id}/toggle-complete`,
      {
        method: 'PATCH',
      }
    );

    // Show success notification based on the completion status
    const task = transformTodoToTask(response);
    toast.success(task.completed ? 'Task marked as completed!' : 'Task marked as incomplete!');

    return transformTodoToTask(response);
  }

  async deleteTask(id: string) {
    return this.request(`/api/v1/todos/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
