'use client';

import React from 'react';
import { useAuth } from '../../../components/providers/auth-provider';
import { GlassCard } from '@/src/components/ui/glass-card';
import { motion } from 'framer-motion';

const DashboardPage: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-6 sm:px-0"
      >
        <GlassCard variant="elevated" className="h-96 flex flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Welcome, {user?.name || user?.email}!</h1>
          <p className="text-muted-foreground text-center">This is your dashboard. Manage your tasks from the navigation menu.</p>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default DashboardPage;