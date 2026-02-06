'use client';

import React from 'react';
import { AuthProvider } from '../components/providers/auth-provider';
import { ThemeProvider } from '@/src/components/theme/theme-provider';
import { Toaster } from 'sonner';

export default function Providers({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <Toaster position="top-right" />
      </AuthProvider>
    </ThemeProvider>
  );
}