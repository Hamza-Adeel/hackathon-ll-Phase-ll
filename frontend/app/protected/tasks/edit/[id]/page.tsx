'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../components/providers/auth-provider';
import { Task } from '../../../../../lib/types';
import { apiClient } from '../../../../../lib/api/client';
import { TaskForm } from '../../../../../components/tasks/task-form';

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

    if (id) {
      fetchTask();
    }
  }, [id, token, router]);

  const handleTaskUpdated = (updatedTask: Task) => {
    // Navigate back to the task details page after successful update
    router.push(`/protected/tasks/${id}`);
  };

  const handleCancel = () => {
    router.push(`/protected/tasks/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error! </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Task not found! </strong>
            <span className="block sm:inline">The requested task does not exist.</span>
          </div>
        </div>
      </div>
    );
  }

  // Prepare initial form data from the task
  const initialFormData = {
    title: task.title,
    description: task.description || '',
    priority: task.priority || 'medium',
    dueDate: task.dueDate || '',
  };

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Task</h1>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            Back
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Update Task Details</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Modify the task information below.</p>
          </div>

          <div className="p-6">
            <TaskForm
              onTaskUpdated={handleTaskUpdated}
              onCancel={handleCancel}
              taskId={id as string}
              initialData={initialFormData}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTaskPage;