'use client';

import React, { useState } from 'react';
import { TaskForm } from '../../../components/tasks/task-form';
import { TaskList } from '../../../components/tasks/task-list';
import { Task } from '../../../lib/types';
import { GradientButton } from '@/src/components/ui/gradient-button';

const TasksPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleTaskCreated = () => {
    // The TaskList component will automatically refresh the list
    setShowForm(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">Your Tasks</h1>
          <GradientButton
            onClick={() => setShowForm(!showForm)}
            variant="primary"
            animate={true}
          >
            {showForm ? 'Cancel' : 'Add Task'}
          </GradientButton>
        </div>

        {showForm && (
          <div className="mb-8">
            <TaskForm onTaskCreated={handleTaskCreated} onCancel={() => setShowForm(false)} />
          </div>
        )}

        <div className="mt-6">
          <TaskList />
        </div>
      </div>
    </div>
  );
};

export default TasksPage;