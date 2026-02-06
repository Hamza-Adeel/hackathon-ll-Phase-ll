import React from 'react';
import { motion, AnimatePresence, MotionProps, TargetAndTransition, Transition } from 'framer-motion';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface OptimizedAnimationProps {
  children: React.ReactNode;
  type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale' | 'bounce' | 'custom';
  isVisible?: boolean;
  duration?: number;
  delay?: number;
  staggerChildren?: number;
  className?: string;
  animateOnce?: boolean;
  easing?: 'easeInOut' | 'easeIn' | 'easeOut' | 'linear' | 'spring' | 'anticipate' | 'circInOut';
  style?: React.CSSProperties;
  motionProps?: MotionProps;
  skipAnimation?: boolean;
}

export const OptimizedAnimation: React.FC<OptimizedAnimationProps> = ({
  children,
  type = 'fade',
  isVisible = true,
  duration = 0.3,
  delay = 0,
  staggerChildren = 0,
  className = '',
  animateOnce = false,
  easing = 'easeInOut',
  style,
  motionProps = {},
  skipAnimation = false
}) => {
  const reducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = React.useState(false);

  const shouldSkipAnimation = skipAnimation || reducedMotion || (animateOnce && hasAnimated);

  const handleAnimationComplete = () => {
    if (animateOnce && !hasAnimated) {
      setHasAnimated(true);
    }
  };

  // Helper function with proper return types to avoid 'any'
  const getAnimationProps = (): {
    initial: TargetAndTransition;
    animate: TargetAndTransition;
    exit: TargetAndTransition;
    transition: Transition;
  } => {
    if (shouldSkipAnimation) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    const baseTransition: Transition = {
      duration: duration,
      delay: delay,
      staggerChildren: staggerChildren,
      type: easing === 'spring' ? 'spring' : 'tween',
      ease: easing === 'spring' ? undefined : easing,
    };

    switch (type) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: baseTransition
        };

      case 'slide-up':
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
          transition: baseTransition
        };

      case 'slide-down':
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: baseTransition
        };

      case 'slide-left':
        return {
          initial: { opacity: 0, x: -20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: -20 },
          transition: baseTransition
        };

      case 'slide-right':
        return {
          initial: { opacity: 0, x: 20 },
          animate: { opacity: 1, x: 0 },
          exit: { opacity: 0, x: 20 },
          transition: baseTransition
        };

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.9 },
          transition: baseTransition
        };

      case 'bounce':
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: {
            opacity: 1,
            scale: [0.8, 1.05, 1],
          },
          exit: { opacity: 0, scale: 0.8 },
          transition: {
            ...baseTransition,
            times: [0, 0.5, 1]
          }
        };

      case 'custom':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: baseTransition
        };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <AnimatePresence mode="wait">
      {isVisible !== false && (
        <motion.div
          initial={animationProps.initial}
          animate={animationProps.animate}
          exit={animationProps.exit}
          transition={animationProps.transition}
          onAnimationComplete={handleAnimationComplete}
          className={className}
          style={style}
          {...motionProps}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
  staggerDelay?: number;
  duration?: number;
  className?: string;
  skipAnimation?: boolean;
}

export const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  type = 'fade',
  staggerDelay = 0.1,
  duration = 0.3,
  className = '',
  skipAnimation = false
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion || skipAnimation) {
    return <div className={className}>{children}</div>;
  }

  const getBaseAnimationProps = () => {
    const baseTransition: Transition = {
      duration: duration,
      ease: 'easeInOut'
    };

    switch (type) {
      case 'slide-up':
        return { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 20 }, transition: baseTransition };
      case 'slide-down':
        return { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: baseTransition };
      case 'slide-left':
        return { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 }, transition: baseTransition };
      case 'slide-right':
        return { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 20 }, transition: baseTransition };
      case 'scale':
        return { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, transition: baseTransition };
      default:
        return { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: baseTransition };
    }
  };

  const baseProps = getBaseAnimationProps();

  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          initial={baseProps.initial}
          animate={baseProps.animate}
          exit={baseProps.exit}
          transition={{
            ...baseProps.transition,
            delay: index * staggerDelay
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
export const useOptimizedAnimation = (dependencies: React.DependencyList) => {
  const reducedMotion = useReducedMotion();

  return React.useMemo(() => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    return {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
      transition: { duration: 0.3, ease: 'easeOut' as const }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, ...dependencies]); 
};