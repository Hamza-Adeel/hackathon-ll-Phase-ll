'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../components/providers/auth-provider';
import { Task } from '../../../../../lib/types';
import { apiClient } from '../../../../../lib/api/client';
import { TaskForm } from '../../../../../components/tasks/task-form';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';

const EditTaskPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!token) {
          router.push('/auth/login');
          return;
        }

        const response = await apiClient.getTaskById(id as string);
        setTask(response);
      } catch (err) {
        setError('Failed to load task for editing');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id, token, router]);

  const handleTaskUpdated = (updatedTask: Task) => {
    router.push(`/protected/tasks/${id}`);
  };

  const handleCancel = () => {
    router.push(`/protected/tasks/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[rgb(var(--color-primary-start))]"></div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <GlassCard
            variant="elevated"
            className={`p-4 ${
              error ? 'bg-red-100/60 border-red-400/40 text-red-800' : 'bg-yellow-100/60 border-yellow-400/40 text-yellow-800'
            }`}
          >
            <strong className="font-bold">{error || 'Task not found!'}</strong>
          </GlassCard>
        </div>
      </div>
    );
  }

  const initialFormData = {
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    dueDate: task.dueDate || '',
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Edit Task</h1>
          <GradientButton
            variant="tertiary"
            animate={true}
            onClick={() => router.back()}
          >
            Back
          </GradientButton>
        </div>

        {/* Task Form Card */}
        <GlassCard variant="elevated" className="overflow-hidden shadow-lg border border-[rgb(var(--color-text-muted))]/20">
          <div className="px-4 py-5 border-b border-[rgb(var(--color-text-muted))]/20">
            <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">Update Task Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-[rgb(var(--color-text-muted))]">
              Modify the task information below.
            </p>
          </div>

          <div className="p-6">
            <TaskForm
              onTaskUpdated={handleTaskUpdated}
              onCancel={handleCancel}
              taskId={id as string}
              initialData={initialFormData}
            />
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default EditTaskPage;
