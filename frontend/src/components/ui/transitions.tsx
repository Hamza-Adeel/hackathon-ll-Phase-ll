'use client';

import React from 'react';
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { animationPresets } from '../../lib/utils/animations';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface TransitionWrapperProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide-up' | 'slide-down' | 'scale-in' | 'bounce';
  isVisible?: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export const TransitionWrapper: React.FC<TransitionWrapperProps> = ({
  children,
  type = 'fade',
  isVisible = true,
  duration = 0.3,
  delay = 0,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const getAnimationVariant = (): HTMLMotionProps<"div"> => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    // Safely casting to handle preset structures
    const preset = (animationPresets[type] || animationPresets.fade) as HTMLMotionProps<"div">;

    return {
      ...preset,
      transition: {
        ...(preset.transition || {}),
        duration: duration,
        delay: delay
      }
    };
  };

  const variant = getAnimationVariant();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          transition={variant.transition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  isVisible?: boolean;
  duration?: number;
  className?: string;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  direction = 'up',
  isVisible = true,
  duration = 0.3,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const getSlideVariant = (): HTMLMotionProps<"div"> => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    let initialX = 0;
    let initialY = 0;

    switch (direction) {
      case 'left': initialX = -20; break;
      case 'right': initialX = 20; break;
      case 'up': initialY = 20; break;
      case 'down': initialY = -20; break;
    }

    return {
      initial: { opacity: 0, x: initialX, y: initialY },
      animate: { opacity: 1, x: 0, y: 0 },
      exit: { opacity: 0, x: initialX, y: initialY },
      transition: { duration, ease: 'easeOut' as const }
    };
  };

  const variant = getSlideVariant();

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={variant.initial}
          animate={variant.animate}
          exit={variant.exit}
          transition={variant.transition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  isVisible?: boolean;
  duration?: number;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  isVisible = true,
  duration = 0.3,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const fadeVariant: HTMLMotionProps<"div"> = reducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration }
      };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          {...fadeVariant}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface ScaleInProps {
  children: React.ReactNode;
  isVisible?: boolean;
  duration?: number;
  className?: string;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  isVisible = true,
  duration = 0.2,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const scaleVariant: HTMLMotionProps<"div"> = reducedMotion
    ? {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      }
    : {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration, ease: 'easeOut' as const }
      };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          {...scaleVariant}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface BounceInProps {
  children: React.ReactNode;
  isVisible?: boolean;
  className?: string;
}

export const BounceIn: React.FC<BounceInProps> = ({
  children,
  isVisible = true,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  const bounceVariant: HTMLMotionProps<"div"> = reducedMotion
    ? { animate: { scale: 1 }, transition: { duration: 0 } }
    : {
        animate: {
          scale: [1, 1.05, 1],
        },
        transition: {
          duration: 0.6,
          ease: 'easeInOut' as const,
          times: [0, 0.5, 1]
        }
      };

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          animate={bounceVariant.animate}
          transition={bounceVariant.transition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};