'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType } from '../../lib/types';
import { apiClient } from '../../lib/api/client';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      apiClient.setToken(storedToken);
      const fetchUser = async () => {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData.user);
          setToken(storedToken);
        } catch {
          // ESLint Fix: Removed unused 'error' variable
          localStorage.removeItem('auth_token');
          apiClient.removeToken();
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });
      const { user: userData, token: newToken } = response;

      // TypeScript Fix: Safe check for token instead of using '!'
      if (newToken) {
        localStorage.setItem('auth_token', newToken);
        apiClient.setToken(newToken);
        setToken(newToken);
      }
      
      setUser(userData);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await apiClient.signup({ name, email, password });
      const { user: userData, token: newToken } = response;

      // TypeScript Fix: Safe check for token
      if (newToken) {
        localStorage.setItem('auth_token', newToken);
        apiClient.setToken(newToken);
        setToken(newToken);
      }

      setUser(userData);
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    apiClient.removeToken();
    setUser(null);
    setToken(null);
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    signup,
    logout,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};