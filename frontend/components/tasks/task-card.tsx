import React, { useState } from 'react';
import { Task } from '../../lib/types';
import { apiClient } from '../../lib/api/client';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { motion } from 'framer-motion';

interface TaskCardProps {
  task: Task;
  onUpdate: (updateFn: (prev: Task[]) => Task[]) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');
  const [loading, setLoading] = useState(false);

  const handleToggleComplete = async () => {
  try {
    setLoading(true);
    const updatedTask = await apiClient.toggleTaskCompletion(task.id);
      // Update the task in the parent component's state
     onUpdate((prev: Task[]) => prev.map(t => t.id === task.id ? updatedTask : t));
    } catch (error) {
      console.error('Error toggling task completion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await apiClient.deleteTask(task.id);

        // Remove the task from the parent component's state
       onUpdate((prev: Task[]) => prev.filter(t => t.id !== task.id));
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveEdit = async () => {
    try {
      setLoading(true);
      const updatedTask = await apiClient.updateTask(task.id, {
        title: editedTitle,
        description: editedDescription,
      });

      // Update the task in the parent component's state
     onUpdate((prev: Task[]) => prev.map(t => t.id === task.id ? updatedTask : t));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description || '');
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <GlassCard variant="elevated" animate={false} className={`p-5 ${task.completed ? 'opacity-75' : ''}`}>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full px-4 py-3 bg-background/30 backdrop-blur-sm border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
              placeholder="Task title"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full px-4 py-3 bg-background/30 backdrop-blur-sm border border-border/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground placeholder-muted-foreground"
              placeholder="Task description"
              rows={3}
            />
            <div className="flex space-x-3">
              <GradientButton
                size="sm"
                onClick={handleSaveEdit}
                disabled={loading}
                variant="primary"
              >
                {loading ? 'Saving...' : 'Save'}
              </GradientButton>
              <GradientButton
                size="sm"
                onClick={handleCancelEdit}
                variant="tertiary"
              >
                Cancel
              </GradientButton>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex items-start">
              <motion.input
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="checkbox"
                checked={task.completed}
                onChange={handleToggleComplete}
                disabled={loading}
                className="mt-1 h-5 w-5 rounded-full border border-border focus:ring-2 focus:ring-primary/50 cursor-pointer"
              />
              <div className="ml-4 flex-1 min-w-0">
                <h3 className={`text-base font-semibold ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm ${task.completed ? 'text-muted-foreground/70' : 'text-foreground/80'} mt-2`}>
                    {task.description}
                  </p>
                )}
                {task.dueDate && (
                  <p className="text-xs text-foreground/60 mt-2">
                    Due: {formatDate(task.dueDate)}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 flex justify-between items-center">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                task.priority === 'high'
                  ? 'bg-linear-to-r from-red-500/20 to-red-600/20 text-red-300 border border-red-500/30'
                  : task.priority === 'medium'
                  ? 'bg-linear-to-r from-yellow-500/20 to-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-linear-to-r from-green-500/20 to-green-600/20 text-green-300 border border-green-500/30'
              }`}>
                {task.priority || 'medium'}
              </span>

              <div className="flex space-x-2">
                <GradientButton
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  variant="tertiary"
                  animate={true}
                >
                  Edit
                </GradientButton>
                <GradientButton
                  size="sm"
                  onClick={handleDelete}
                  disabled={loading}
                  variant="tertiary"
                  animate={true}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </GradientButton>
              </div>
            </div>
          </>
        )}
      </GlassCard>
    </motion.div>
  );
};