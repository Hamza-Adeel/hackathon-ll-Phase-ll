'use client';

import React from 'react';
import { HTMLMotionProps, motion } from 'framer-motion';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
  children?: React.ReactNode;
  showChildren?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  borderRadius = '0.5rem',
  animation = 'pulse',
  className = '',
  children,
  showChildren = false
}) => {
  const reducedMotion = useReducedMotion();

  if (children && showChildren) {
    return <>{children}</>;
  }

  // FIX 1: Explicitly defining return types to satisfy Framer Motion's complex transition types
  const getPulseAnimation = (): HTMLMotionProps<"div"> => {
    if (reducedMotion || animation === 'none') return {};
    return {
      initial: { opacity: 1 },
      animate: { opacity: [1, 0.5, 1] },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut" as const // Using 'as const' to fix the easing string error
      }
    };
  };

  const getWaveAnimation = (): HTMLMotionProps<"div"> => {
    if (reducedMotion || animation === 'none') return {};
    return {
      initial: { x: '-100%' },
      animate: { x: '100%' },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear" as const // Using 'as const' ensures it's not just any string
      }
    };
  };

  const animationProps = animation === 'wave' ? getWaveAnimation() : getPulseAnimation();

  const skeletonStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    borderRadius: borderRadius,
    backgroundColor: 'rgba(156, 163, 175, 0.1)',
    display: 'inline-block',
    lineHeight: 1,
    verticalAlign: 'middle',
    position: 'relative', 
    overflow: 'hidden'
  };

  return (
    <motion.div
      style={skeletonStyle}
      className={`skeleton ${className}`}
      {...animationProps}
    >
      {animation === 'wave' && !reducedMotion && (
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.2), transparent)`,
            borderRadius: borderRadius,
          }}
          {...getWaveAnimation()}
        />
      )}
    </motion.div>
  );
};

// --- Spinner & Overlay ---

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent';
  animation?: 'spin' | 'pulse' | 'bounce' | 'none';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  animation = 'spin',
  className = ''
}) => {
  const reducedMotion = useReducedMotion();
  const sizeClasses = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  const colorClasses = { primary: 'text-purple-500', secondary: 'text-blue-500', accent: 'text-pink-500' };

  const animationClasses = reducedMotion || animation === 'none'
    ? ''
    : animation === 'spin' ? 'animate-spin' : animation === 'pulse' ? 'animate-pulse' : 'animate-bounce';

  return (
    <div className={`inline-block ${sizeClasses[size]} ${colorClasses[color]} ${animationClasses} ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-full h-full">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" stroke="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  className = ''
}) => {
  // FIX 2: Removed unused reducedMotion hook call
  if (!isLoading) return <>{children}</>;

  return (
    <div className={`relative ${className}`}>
      <div className="opacity-40 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center">
        <LoadingSpinner size="lg" color="primary" />
      </div>
    </div>
  );
};

// --- Animated Loaders ---

interface AnimatedLoaderProps {
  type?: 'bars' | 'dots' | 'circles' | 'progress';
  className?: string;
}

export const AnimatedLoader: React.FC<AnimatedLoaderProps> = ({
  type = 'bars',
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  switch (type) {
    case 'bars':
      return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-6 bg-current rounded-full"
              animate={{ scaleY: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      );
    case 'dots':
      return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-current rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      );
    case 'progress':
      return (
        <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`}>
          <motion.div
            className="bg-current h-2.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'linear' as const }}
          />
        </div>
      );
    default:
      return <LoadingSpinner />;
  }
};