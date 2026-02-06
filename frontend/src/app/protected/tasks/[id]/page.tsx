'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/providers/auth-provider';
import { Task } from '../../../../lib/types';
import { apiClient } from '../../../../lib/api/client';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';

const TaskDetailPage: React.FC = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        if (!id) {
          setError('Task ID is missing');
          setLoading(false);
          return;
        }
        const response = await apiClient.getTaskById(id as string);
        setTask(response);
      } catch (err) {
        setError('Failed to load task');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTask();
  }, [id]);

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
          <GlassCard variant="elevated" className="p-4 bg-red-100/60 border border-red-400/40 text-red-800">
            <strong className="font-bold">{error || 'Task not found!'}</strong>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Task Details</h1>
          <GradientButton
            variant="tertiary"
            animate={true}
            onClick={() => router.back()}
          >
            Back to Tasks
          </GradientButton>
        </div>

        {/* Task Card */}
        <GlassCard variant="elevated" className="overflow-hidden shadow-lg border border-[rgb(var(--color-text-muted))]/20">
          {/* Header */}
          <div className="px-4 py-5 border-b border-[rgb(var(--color-text-muted))]/20">
            <h3 className="text-lg font-medium text-[rgb(var(--color-text-primary))]">{task.title}</h3>
            <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">Details and information about the task.</p>
          </div>

          {/* Details */}
          <div>
            <dl className="divide-y divide-[rgb(var(--color-text-muted))]/20">
              {[
                { label: 'Title', value: task.title },
                { label: 'Description', value: task.description || 'No description provided' },
                { label: 'Status', value: task.completed ? 'Completed' : 'Pending', type: 'status' },
                { label: 'Priority', value: task.priority || 'Normal', type: 'priority' },
                { label: 'Due Date', value: task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date' },
                { label: 'Created', value: new Date(task.createdAt).toLocaleString() },
                { label: 'Last Updated', value: new Date(task.updatedAt).toLocaleString() },
              ].map((item, idx) => (
                <div key={idx} className={`${idx % 2 === 0 ? 'bg-[rgb(var(--color-bg-secondary))]/30' : 'bg-[rgb(var(--color-bg-secondary))]/10'} px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6`}>
                  <dt className="text-sm font-medium text-[rgb(var(--color-text-muted))]">{item.label}</dt>
                  <dd className="mt-1 text-sm text-[rgb(var(--color-text-primary))] sm:mt-0 sm:col-span-2">
                    {item.type === 'status' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.completed
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>{item.value}</span>
                    ) : item.type === 'priority' ? (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        task.priority === 'high'
                          ? 'bg-red-100 text-red-800'
                          : task.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                      }`}>{item.value.charAt(0).toUpperCase() + item.value.slice(1)}</span>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Actions */}
          <div className="px-4 py-4 flex justify-end space-x-3 bg-[rgb(var(--color-bg-secondary))]/20 border-t border-[rgb(var(--color-text-muted))]/20">
            <GradientButton
              variant="tertiary"
              animate={true}
              onClick={() => router.push('/protected/tasks')}
            >
              Cancel
            </GradientButton>
            <GradientButton
              variant="primary"
              animate={true}
              onClick={() => router.push(`/protected/tasks/edit/${id}`)}
            >
              Edit Task
            </GradientButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default TaskDetailPage;
