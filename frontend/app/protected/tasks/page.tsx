'use client';

import React, { useState } from 'react';
import { TaskForm } from '../../../components/tasks/task-form';
import { TaskList } from '../../../components/tasks/task-list';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { GlassCard } from '@/src/components/ui/glass-card';

const TasksPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleTaskCreated = () => {
    // TaskList auto-refreshes
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text-primary))]">Your Tasks</h1>
        <GradientButton
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'tertiary' : 'primary'}
          animate={true}
        >
          {showForm ? 'Cancel' : 'Add Task'}
        </GradientButton>
      </div>

      {/* Task Form */}
      {showForm && (
        <GlassCard variant="elevated" className="p-6 mb-6 shadow-lg">
          <TaskForm
            onTaskCreated={handleTaskCreated}
            onCancel={() => setShowForm(false)}
          />
        </GlassCard>
      )}

      {/* Task List */}
      <GlassCard variant="elevated" className="p-6 shadow-lg">
        <TaskList />
      </GlassCard>
    </div>
  );
};

export default TasksPage;
