'use client';

import React from 'react';
import { useAuth } from '../../components/providers/auth-provider';
import { ProtectedRoute } from '../../components/providers/protected-route';
import { useRouter } from 'next/navigation';

const ProtectedLayoutContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-semibold text-foreground">Todo App</h1>
              </div>
              <nav className="ml-6 flex space-x-8">
                <a
                  href="/protected/dashboard"
                  className="border-transparent text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Dashboard
                </a>
                <a
                  href="/protected/tasks"
                  className="border-transparent text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Tasks
                </a>
                <a
                  href="/protected/profile"
                  className="border-transparent text-muted-foreground hover:bg-accent hover:text-foreground inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Profile
                </a>
              </nav>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-destructive rounded-md hover:bg-destructive/90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main>
        {children}
      </main>
    </div>
  );
};

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ProtectedRoute>
      <ProtectedLayoutContent>{children}</ProtectedLayoutContent>
    </ProtectedRoute>
  );
};

export default ProtectedLayout;