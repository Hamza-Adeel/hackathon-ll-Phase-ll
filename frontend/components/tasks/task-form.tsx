import React, { useState } from 'react';
import { apiClient } from '../../lib/api/client';
import { Task } from '../../lib/types';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { GlassInput } from '@/src/components/ui/glass-input';
import { motion } from 'framer-motion';

interface TaskFormProps {
  onTaskCreated?: (task: Task) => void;
  onTaskUpdated?: (task: Task) => void;
  onCancel?: () => void;
  taskId?: string; // If provided, we're editing; if not, we're creating
  initialData?: Partial<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  }>;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onTaskCreated,
  onTaskUpdated,
  onCancel,
  taskId,
  initialData
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    dueDate: initialData?.dueDate || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;
      if (taskId) {
        // Update existing task
        response = await apiClient.updateTask(taskId, {
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
        });
        if (onTaskUpdated) {
          onTaskUpdated(response);
        }
      } else {
        // Create new task
        response = await apiClient.createTask({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          dueDate: formData.dueDate || undefined,
        });
        if (onTaskCreated) {
          onTaskCreated(response);
        }

        // Reset form only for new tasks
        if (!taskId) {
          setFormData({
            title: '',
            description: '',
            priority: 'medium',
            dueDate: '',
          });
        }
      }
    } catch (err) {
      setError(taskId ? 'Failed to update task. Please try again.' : 'Failed to create task. Please try again.');
      console.error(taskId ? 'Error updating task:' : 'Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard variant="elevated" className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-5">{taskId ? 'Edit Task' : 'Create New Task'}</h3>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <GlassInput
              label="Title *"
              id="title"
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Task title"
            />
          </div>

          <div>
            <GlassInput
              label="Description"
              id="description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={handleChange}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-foreground mb-2">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-background/30 backdrop-blur-sm border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <GlassInput
                label="Due Date"
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="flex space-x-4 pt-3">
            <GradientButton
              type="submit"
              disabled={loading}
              variant="primary"
              animate={true}
            >
              {loading ? (taskId ? 'Updating...' : 'Creating...') : (taskId ? 'Update Task' : 'Create Task')}
            </GradientButton>

            {onCancel && (
              <GradientButton
                type="button"
                onClick={onCancel}
                variant="tertiary"
                animate={true}
              >
                Cancel
              </GradientButton>
            )}
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
};