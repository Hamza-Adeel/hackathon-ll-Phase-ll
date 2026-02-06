'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '../../lib/types';
import { apiClient } from '../../lib/api/client';
import { Spinner } from '../ui/spinner';
import { TaskCard } from './task-card';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  userId?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ userId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await apiClient.getTasks();
        // The API returns an array of tasks directly, not wrapped in a tasks property
        setTasks(Array.isArray(response) ? response : []);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error('Error fetching tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex justify-center items-center h-64"
      >
        <Spinner size="lg" />
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 mb-6 rounded-2xl bg-destructive/10 border border-destructive/20"
      >
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-destructive" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16"
      >
        <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No tasks yet</h3>
        <p className="text-sm text-muted-foreground mb-6">Get started by creating your first task.</p>
        <GradientButton variant="primary">
          Create Your First Task
        </GradientButton>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <AnimatePresence>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <TaskCard key={task.id} task={task} onUpdate={setTasks} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};