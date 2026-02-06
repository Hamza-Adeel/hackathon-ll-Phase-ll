import { useState, useCallback } from 'react';
import { getAnimationProps, hoverVariants } from './animations';

interface HoverAnimationOptions {
  disabled?: boolean;
  variant?: keyof typeof hoverVariants;
}

export const useHoverAnimation = (options: HoverAnimationOptions = {}) => {
  const { disabled = false, variant = 'default' } = options;
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    if (!disabled) {
      setIsHovered(true);
    }
  }, [disabled]);

  const handleMouseLeave = useCallback(() => {
    if (!disabled) {
      setIsHovered(false);
    }
  }, [disabled]);

  const animationState = getAnimationProps(
    isHovered && !disabled
      ? hoverVariants[variant]
      : { scale: 1, transition: { duration: 0.2, ease: 'easeInOut' } }
  );

  return {
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
    animationState,
    hoverStyle: {
      transform: isHovered && !disabled ? animationState.scale || 'scale(1.03)' : 'scale(1)',
      transition: 'transform 0.2s ease-in-out',
    }
  };
};