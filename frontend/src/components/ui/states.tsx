'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './transitions';
import { Typography } from './typography';
import { LoadingSpinner } from './skeleton';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = '',
  isLoading = false
}) => {
  return (
    <FadeIn>
      <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" color="primary" />
            <Typography variant="h5" weight="medium" className="mt-4">
              Loading...
            </Typography>
          </div>
        ) : (
          <>
            {icon && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
                className="mb-6"
              >
                {icon}
              </motion.div>
            )}

            <Typography variant="h4" weight="semibold" className="text-center mb-2">
              {title}
            </Typography>

            {description && (
              <Typography variant="body1" color="muted" className="text-center mb-6 max-w-md">
                {description}
              </Typography>
            )}

            {action && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {action}
              </motion.div>
            )}
          </>
        )}
      </div>
    </FadeIn>
  );
};

interface SuccessStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title,
  description,
  icon,
  action,
  className = ''
}) => {
  return (
    <FadeIn>
      <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
        {icon && (
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.1
            }}
            className="mb-6 text-green-500"
          >
            {icon}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" weight="semibold" className="text-center mb-2 text-green-600 dark:text-green-400">
            {title}
          </Typography>

          {description && (
            <Typography variant="body1" color="muted" className="text-center mb-6 max-w-md">
              {description}
            </Typography>
          )}
        </motion.div>

        {action && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </FadeIn>
  );
};

interface ErrorStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  description,
  icon,
  action,
  className = ''
}) => {
  return (
    <FadeIn>
      <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
        {icon && (
          <motion.div
            initial={{ scale: 0, rotate: 10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.1
            }}
            className="mb-6 text-red-500"
          >
            {icon}
          </motion.div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Typography variant="h4" weight="semibold" className="text-center mb-2 text-red-600 dark:text-red-400">
            {title}
          </Typography>

          {description && (
            <Typography variant="body1" color="muted" className="text-center mb-6 max-w-md">
              {description}
            </Typography>
          )}
        </motion.div>

        {action && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {action}
          </motion.div>
        )}
      </div>
    </FadeIn>
  );
};

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  title = "Loading...",
  description,
  className = '',
  size = 'md'
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-12 px-4 ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          ease: "linear" as const,
          duration: 1.5 // Fixed: Removed duplicate duration property
        }}
      >
        <LoadingSpinner size={size} color="primary" />
      </motion.div>

      {title && (
        <Typography variant="h6" weight="medium" className="mt-4">
          {title}
        </Typography>
      )}

      {description && (
        <Typography variant="body2" color="muted" className="mt-2 text-center">
          {description}
        </Typography>
      )}
    </div>
  );
};

interface StateWrapperProps {
  isEmpty?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  isLoading?: boolean;
  emptyState: React.ReactNode;
  successState?: React.ReactNode;
  errorState?: React.ReactNode;
  loadingState?: React.ReactNode;
  children: React.ReactNode;
}

export const StateWrapper: React.FC<StateWrapperProps> = ({
  isEmpty = false,
  isSuccess = false,
  isError = false,
  isLoading = false,
  emptyState,
  successState,
  errorState,
  loadingState,
  children
}) => {
  if (isLoading) {
    return loadingState || <LoadingState />;
  }

  if (isEmpty) {
    return emptyState;
  }

  if (isError) {
    return errorState || (
      <ErrorState
        title="Something went wrong"
        description="Please try again later"
      />
    );
  }

  if (isSuccess) {
    return successState || (
      <SuccessState
        title="Operation completed"
        description="Everything worked as expected"
      />
    );
  }

  return <>{children}</>;
};