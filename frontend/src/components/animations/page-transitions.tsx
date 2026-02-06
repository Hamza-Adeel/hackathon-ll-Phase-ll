import React from 'react';
import { motion, AnimatePresence, Transition, Variants } from 'framer-motion';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface PageTransitionProps {
  children: React.ReactNode;
  locationKey?: string;
  type?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'zoom' | 'scale';
  className?: string;
}

const transitionConfig: Transition = { 
  duration: 0.3, 
  ease: [0.43, 0.13, 0.23, 0.96]
};

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  locationKey,
  type = 'fade',
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  // Define animation variants based on type
  const getAnimationVariants = (): Variants => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        
      };
    }
      const commonTransition = { transition: transitionConfig };

    switch (type) {
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0, ...commonTransition },
          exit: { opacity: 0, x: -50, ...commonTransition }
        };
      case 'slide-right':
        return {
          initial: { opacity: 0, x: -50 },
          animate: { opacity: 1, x: 0, ...commonTransition },
          exit: { opacity: 0, x: 50, ...commonTransition }
        };
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 50 },
          animate: { opacity: 1, y: 0, ...commonTransition },
          exit: { opacity: 0, y: -50, ...commonTransition }
        };
      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1, ...commonTransition },
          exit: { opacity: 0, scale: 0.9, ...commonTransition }
        };
      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1, ...commonTransition },
          exit: { opacity: 0, scale: 0.8, ...commonTransition }
        };
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, ...commonTransition },
          exit: { opacity: 0, ...commonTransition }
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={locationKey}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

interface PageTransitionWrapperProps {
  children: React.ReactNode;
  pathname: string;
  type?: 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'zoom' | 'scale';
  className?: string;
}

export const PageTransitionWrapper: React.FC<PageTransitionWrapperProps> = ({
  children,
  pathname,
  type = 'fade',
  className = ''
}) => {
  return (
    <PageTransition
      locationKey={pathname}
      type={type}
      className={className}
    >
      {children}
    </PageTransition>
  );
};

// Custom hook for page transitions
export const usePageTransition = (type: PageTransitionProps['type'] = 'fade') => {
  const reducedMotion = useReducedMotion();

  const getPageTransitionProps = () => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    const transition = { duration: 0.3, ease: 'easeInOut' as const };

   switch (type) {
      case 'slide-left':
        return {
          initial: { opacity: 0, x: 50 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -50 },
          transition
        };

      case 'slide-right':
        return {
          initial: { opacity: 0, x: -50},
          animate: { opacity: 1, x: 0},
          exit: { opacity: 0, x: 50},
          transition
        };

      case 'slide-up':
        return {
          initial: { opacity: 0, y: 50},
          animate: { opacity: 1, y: 0},
          exit: { opacity: 0, y: -50},
          transition
        };

      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9},
          transition
        };

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.8},
          transition
        };

      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition
        };
    }
  };

  return getPageTransitionProps();
};

// Preset transition components for common use cases
export const FadeTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <PageTransition type="fade" className={className}>
    {children}
  </PageTransition>
);

export const SlideLeftTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <PageTransition type="slide-left" className={className}>
    {children}
  </PageTransition>
);

export const SlideRightTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <PageTransition type="slide-right" className={className}>
    {children}
  </PageTransition>
);

export const SlideUpTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <PageTransition type="slide-up" className={className}>
    {children}
  </PageTransition>
);

export const ZoomTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <PageTransition type="zoom" className={className}>
    {children}
  </PageTransition>
);

export const ScaleTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <PageTransition type="scale" className={className}>
    {children}
  </PageTransition>
);