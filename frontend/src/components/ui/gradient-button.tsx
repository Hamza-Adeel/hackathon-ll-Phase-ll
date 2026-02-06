'use client';

import React from 'react';
import { motion, AnimatePresence, easeInOut, easeOut } from 'framer-motion';

interface GradientButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  animate?: boolean;

}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  disabled = false,
  type = 'button',
  icon,
  iconPosition = 'left',
  isLoading = false,
  animate = true,
  
}) => {
  // Determine button styles based on variant
  const getButtonStyles = () => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
    ];

    // Size classes
    let sizeClasses = '';
    switch (size) {
      case 'sm':
        sizeClasses = 'text-xs h-8 px-3';
        break;
      case 'md':
        sizeClasses = 'text-sm h-10 px-4';
        break;
      case 'lg':
        sizeClasses = 'text-base h-12 px-6';
        break;
    }

    // Variant classes
    let variantClasses = '';
    switch (variant) {
      case 'primary':
        variantClasses = 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 focus-visible:ring-pink-500';
        break;
      case 'secondary':
        variantClasses = 'border border-transparent bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus-visible:ring-blue-500';
        break;
      case 'tertiary':
        variantClasses = 'bg-transparent text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus-visible:ring-purple-500';
        break;
      case 'disabled':
        variantClasses = 'bg-gray-300 text-gray-500 cursor-not-allowed';
        break;
    }

    return `${baseClasses.join(' ')} ${sizeClasses} ${variantClasses} ${className}`;
  };

  // Simple hover animation without external dependencies
  const animationVariants = {
    scale: 1.03,
    transition: { duration: 0.2, ease: easeInOut }
  };

  const handleClick = () => {
    if (!disabled && !isLoading && onClick) {
      onClick();
    }
  };

  return (
    <motion.button
      type={type as 'button' | 'submit' | 'reset'}
      className={getButtonStyles()}
      onClick={handleClick}
      disabled={disabled || isLoading}
      whileHover={animate && !disabled && !isLoading ? animationVariants : undefined}
      whileTap={!disabled && !isLoading ? { scale: 0.98, transition: { duration: 0.1, ease: easeOut } } : undefined}
      aria-disabled={disabled || isLoading}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center"
          >
            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>
            Loading...
          </motion.span>
        ) : (
          <motion.span
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center"
          >
            {icon && iconPosition === 'left' && (
              <span className="mr-2">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="ml-2">{icon}</span>
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};