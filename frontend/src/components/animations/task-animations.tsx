import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface TaskItemProps {
  id: string;
  children: React.ReactNode;
  isCompleted?: boolean;
  isDeleting?: boolean;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;
  onToggle?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  id,
  children,
  isCompleted = false,
  isDeleting = false,
  priority = 'medium',
  category,
  createdAt,
  updatedAt,
  onToggle,
  onDelete,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const getPriorityStyles = () => {
    switch (priority) {
      case 'high': return 'border-l-4 border-l-orange-500';
      case 'critical': return 'border-l-4 border-l-red-500';
      case 'low': return 'border-l-4 border-l-green-500';
      default: return 'border-l-4 border-l-blue-500';
    }
  };

  const getTaskVariants = (): Variants => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 }
      };
    }
    return {
      initial: { opacity: 0, y: -20, height: 0 },
      animate: {
        opacity: 1,
        y: 0,
        height: 'auto',
        transition: { duration: 0.2, ease: 'easeOut' }
      },
      exit: {
        opacity: 0,
        y: 20,
        height: 0,
        transition: { duration: 0.2, ease: 'easeIn' }
      }
    };
  };

  const getCompletionVariants = (): Variants => {
    if (reducedMotion) return { animate: { scale: 1, opacity: 1 } };
    return {
      animate: {
        scale: [1, 1.02, 1],
        opacity: isCompleted ? 0.7 : 1,
        transition: { duration: 0.3, ease: 'easeInOut' }
      }
    };
  };

  const getDeletionVariants = (): Variants => {
    if (reducedMotion) return { animate: { scale: 1, opacity: 1 } };
    return {
      animate: {
        scale: isDeleting ? 0.95 : 1,
        opacity: isDeleting ? 0.5 : 1,
        transition: { duration: 0.2, ease: 'easeOut' }
      }
    };
  };

  const taskVariants = getTaskVariants();
  const completionVariants = getCompletionVariants();
  const deletionVariants = getDeletionVariants();

  return (
    <motion.div
      key={id}
      layout
      variants={taskVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`task-item ${className} ${isCompleted ? 'completed' : ''}`}
    >
      <motion.div
        variants={completionVariants}
        animate="animate"
        className={`task-content flex items-start p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${getPriorityStyles()}`}
        onClick={onToggle}
      >
        <motion.div
          variants={deletionVariants}
          animate="animate"
          className="task-controls flex items-start mt-1 mr-4"
        >
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={onToggle}
            className={`h-5 w-5 rounded border-gray-300 focus:ring-${priority === 'critical' ? 'red' : priority === 'high' ? 'orange' : priority === 'low' ? 'green' : 'blue'}-500`}
          />

          {onDelete && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="ml-3 text-gray-500 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 rounded mt-0.5"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </motion.button>
          )}
        </motion.div>

        <div className="task-text grow">
          <motion.div
            animate={{
              textDecoration: isCompleted ? 'line-through' : 'none',
              opacity: isCompleted ? 0.7 : 1,
            }}
            className="task-content-text"
          >
            {children}
          </motion.div>

          {(category || createdAt) && (
            <div className="task-meta mt-1 flex flex-wrap gap-2 text-xs text-gray-500 dark:text-gray-400">
              {category && (
                <span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30">
                  {category}
                </span>
              )}
              {createdAt && <span>Created: {createdAt.toLocaleDateString()}</span>}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

interface TaskListProps {
  children: React.ReactNode[];
  className?: string;
  title?: string;
  subtitle?: string;
}

export const TaskList: React.FC<TaskListProps> = ({ children, className = '', title, subtitle }) => {
  const reducedMotion = useReducedMotion();

  const getListVariants = (): Variants => {
    if (reducedMotion) return { animate: {} };
    return {
      animate: {
        transition: { staggerChildren: 0.05 }
      }
    };
  };

  const listVariants = getListVariants();

  return (
    <div className={`task-list-container ${className}`}>
      {title && (
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl font-semibold mb-4 text-gray-900 dark:text-white"
        >
          {title}
        </motion.h2>
      )}
      <motion.div
        variants={listVariants}
        animate="animate"
        className="task-list"
      >
        <AnimatePresence>
          {children}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

interface TaskAddAnimationProps {
  children: React.ReactNode;
  isAdding?: boolean;
  className?: string;
}

export const TaskAddAnimation: React.FC<TaskAddAnimationProps> = ({
  children,
  isAdding = false,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const getAddVariants = (): Variants => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 }
      };
    }
    return {
      initial: { opacity: 0, scale: 0.8, y: 20 },
      animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      },
      exit: { opacity: 0, scale: 0.8, y: -20 }
    };
  };

  const addVariants = getAddVariants();

  return (
    <motion.div
      variants={addVariants}
      initial={isAdding ? "initial" : false}
      animate={isAdding ? "animate" : false}
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface TaskCompletionAnimationProps {
  children: React.ReactNode;
  isCompleted: boolean;
  onComplete?: () => void;
  className?: string;
}

export const TaskCompletionAnimation: React.FC<TaskCompletionAnimationProps> = ({
  children,
  isCompleted,
  onComplete,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const getCompletionVariants = (): Variants => {
    if (reducedMotion) return { animate: { opacity: 1, scale: 1 } };
    return {
      animate: {
        scale: isCompleted ? [1, 1.02, 1] : 1,
        opacity: isCompleted ? 0.7 : 1,
        transition: { duration: 0.3, ease: 'easeInOut' }
      }
    };
  };

  const completionVariants = getCompletionVariants();

  return (
    <motion.div
      variants={completionVariants}
      animate="animate"
      className={className}
      onAnimationComplete={() => isCompleted && onComplete && onComplete()}
    >
      {children}
    </motion.div>
  );
};

export const EnhancedTaskItem: React.FC<any> = ({ id, title, description, isCompleted, priority, onDelete, onToggle, className = '' }) => {
  return (
    <motion.div
      key={id}
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`enhanced-task-item rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <div className="flex items-start">
        <input type="checkbox" checked={isCompleted} onChange={onToggle} className="mt-1 h-5 w-5" />
        <div className="ml-3 grow">
          <h3 className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>{title}</h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {onDelete && <button onClick={onDelete} className="text-gray-400 hover:text-red-500">Delete</button>}
      </div>
    </motion.div>
  );
};