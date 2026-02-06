// User Entity
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

// Task Entity
export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

// Session Entity
export interface Session {
  token: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

// API Response Structures
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

export interface TaskResponse {
  data: Task | Task[];
  message?: string;
  error?: string;
}

export interface ErrorResponse {
  error: string;
  code: string;
  details?: object;
}

// Component State Models
export interface LoginFormState {
  email: string;
  password: string;
  loading: boolean;
  error: string;
}

export interface SignupFormState {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string;
}

export interface TaskFormState {
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  loading: boolean;
  error: string;
}

export interface TaskListState {
  tasks: Task[];
  loading: boolean;
  error: string;
  filter: 'all' | 'active' | 'completed';
  sort: 'date' | 'priority';
}

export interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration: number;
}

// API Request/Response Models
export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface TaskListResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

// Context Types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}