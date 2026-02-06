import React from 'react';
import { motion, Variants } from 'framer-motion';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface MicroInteractionProps {
  children: React.ReactNode;
  type?: 'hover' | 'click' | 'focus' | 'press' | 'glow';
  className?: string;
  disabled?: boolean;
  onTap?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  type = 'hover',
  className = '',
  disabled = false,
  onTap,
  onMouseEnter,
  onMouseLeave,
}) => {
  const reducedMotion = useReducedMotion();

  // Skip micro-interactions if reduced motion is preferred or if disabled
  if (reducedMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  // Define animation variants based on interaction type
  const getAnimationVariants = (): Variants => {
    switch (type) {
      case 'click':
      case 'press':
        return {
          rest: { scale: 1 },
          pressed: { scale: 0.98 },
          hover: { scale: 1.02 }
        };

      case 'glow':
        return {
          rest: {
            scale: 1,
            textShadow: '0 0 0px rgba(0, 0, 0, 0)'
          },
          hover: {
            scale: 1.03,
            textShadow: '0 0 8px rgba(123, 31, 162, 0.5)'
          }
        };

      case 'focus':
        return {
          rest: {
            scale: 1,
            boxShadow: '0 0 0 0 rgba(59, 130, 246, 0)'
          },
          focused: {
            scale: 1.01,
            boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.5)'
          }
        };

      case 'hover':
      default:
        return {
          rest: { scale: 1 },
          hover: { scale: 1.03 }
        };
    }
  };

  const variants = getAnimationVariants();

  return (
    <motion.div
      className={className}
      variants={variants}
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "pressed" : undefined}
      initial="rest"
      animate="rest"
      onClick={!disabled ? onTap : undefined}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </motion.div>
  );
};

interface RippleEffectProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

export const RippleEffect: React.FC<RippleEffectProps> = ({
  children,
  className = '',
  disabled = false
}) => {
  const reducedMotion = useReducedMotion();
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);
  const idCounter = React.useRef(0);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || reducedMotion) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = { x, y, id: idCounter.current++ };
    setRipples(prev => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <div
      className={className}
      onClick={handleClick}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {children}
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full bg-current opacity-30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          initial={{ width: 0, height: 0, opacity: 0.5 }}
          animate={{
            width: 200,
            height: 200,
            opacity: 0,
            x: -100,
            y: -100
          }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      ))}
    </div>
  );
};

interface PulseInteractionProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  duration?: number;
}

export const PulseInteraction: React.FC<PulseInteractionProps> = ({
  children,
  className = '',
  disabled = false,
  duration = 2
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.03, 1],
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

interface BreathingEffectProps {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  duration?: number;
}

export const BreathingEffect: React.FC<BreathingEffectProps> = ({
  children,
  className = '',
  disabled = false,
  duration = 4
}) => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      animate={{
        scale: [1, 1.02, 1],
        opacity: [1, 0.95, 1]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
  disabled?: boolean;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  content,
  position = 'top',
  className = '',
  disabled = false
}) => {
  const reducedMotion = useReducedMotion();
  const [isVisible, setIsVisible] = React.useState(false);

  const getPositionStyle = () => {
    switch (position) {
      case 'top':
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-0.5rem)' };
      case 'bottom':
        return { top: '100%', left: '50%', transform: 'translateX(-50%) translateY(0.5rem)' };
      case 'left':
        return { right: '100%', top: '50%', transform: 'translateY(-50%) translateX(-0.5rem)' };
      case 'right':
        return { left: '100%', top: '50%', transform: 'translateY(-50%) translateX(0.5rem)' };
      default:
        return { bottom: '100%', left: '50%', transform: 'translateX(-50%) translateY(-0.5rem)' };
    }
  };

  if (reducedMotion || disabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute z-50 bg-gray-900 text-white text-sm py-2 px-3 rounded-md shadow-lg whitespace-nowrap"
          style={getPositionStyle()}
        >
          {content}
          <div className="absolute w-2 h-2 bg-gray-900 transform rotate-45"
            style={{
              top: position === 'bottom' ? '-4px' : position === 'top' ? 'auto' : '50%',
              bottom: position === 'top' ? '-4px' : 'auto',
              left: position === 'right' ? '-4px' : position === 'left' ? 'auto' : '50%',
              right: position === 'left' ? '-4px' : 'auto',
              transform: `translate(-50%, -50%) rotate(45deg)`,
            }}
          />
        </motion.div>
      )}
    </div>
  );
};

// Hook for creating custom micro-interactions
export const useMicroInteraction = (options: {
  type?: 'hover' | 'click' | 'press' | 'glow';
  scale?: number;
  duration?: number;
  disabled?: boolean;
} = {}) => {
  const reducedMotion = useReducedMotion();
  const { type = 'hover', scale = 1.03, duration = 0.2, disabled = false } = options;

  const isDisabled = reducedMotion || disabled;

  const getVariants = (): Variants => {
    if (isDisabled) {
      return { rest: { scale: 1 }, hover: { scale: 1 }, tap: { scale: 1 } };
    }

    const baseVariants = {
      rest: { scale: 1 },
      hover: { scale },
      tap: { scale: scale * 0.98 }
    };

    switch (type) {
      case 'glow':
        return {
          ...baseVariants,
          hover: {
            scale,
            textShadow: '0 0 8px rgba(123, 31, 162, 0.5)'
          }
        };
      case 'press':
        return {
          ...baseVariants,
          tap: { scale: scale * 0.95 }
        };
      default:
        return baseVariants;
    }
  };

  return {
    variants: getVariants(),
    isDisabled,
    transition: { duration }
  };
};