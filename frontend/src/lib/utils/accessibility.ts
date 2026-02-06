import { useState, useEffect } from 'react';

/**
 * Hook to detect user's preference for reduced motion
 * @returns boolean indicating whether reduced motion is preferred
 */
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(false);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window !== 'undefined') {
      // Create media query to detect reduced motion preference
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

      // Set initial value
      setPrefersReducedMotion(mediaQuery.matches);

      // Add event listener to update when preference changes
      const handleChange = (event: MediaQueryListEvent) => {
        setPrefersReducedMotion(event.matches);
      };

      // Safari < 14 requires addListener/removeListener
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener('change', handleChange);
      } else {
        // @ts-ignore
        mediaQuery.addListener(handleChange);
      }

      // Cleanup function to remove event listener
      return () => {
        if (mediaQuery.removeEventListener) {
          mediaQuery.removeEventListener('change', handleChange);
        } else {
          // @ts-ignore
          mediaQuery.removeListener(handleChange);
        }
      };
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to get appropriate animation properties based on reduced motion preference
 * @param defaultAnimationProps - The animation properties to use when reduced motion is not preferred
 * @returns Animation properties adjusted for user's motion preferences
 */
export const useReducedMotionAnimation = <T extends Record<string, any>>(
  defaultAnimationProps: T
): T => {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    // Return animation properties that disable or minimize animations
    return {
      ...defaultAnimationProps,
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0, ...defaultAnimationProps.transition }
    } as T;
  }

  return defaultAnimationProps;
};

/**
 * Function to conditionally apply animation based on reduced motion preference
 * @param animationFn - Function that returns animation properties
 * @returns Animation properties adjusted for user's motion preferences
 */
export const conditionalAnimation = <T extends Record<string, any>>(
  animationFn: () => T
): T => {
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      const defaultAnimation = animationFn();
      return {
        ...defaultAnimation,
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0, ...defaultAnimation.transition }
      } as T;
    }
  }

  return animationFn();
};

/**
 * Utility function to get appropriate easing based on reduced motion preference
 * @param standardEasing - The standard easing function
 * @param reducedMotionEasing - The easing function to use when reduced motion is preferred
 * @returns Appropriate easing function based on user preference
 */
export const getEasingForMotionPreference = (
  standardEasing: string = 'ease',
  reducedMotionEasing: string = 'ease'
): string => {
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? reducedMotionEasing : standardEasing;
  }
  return standardEasing;
};

/**
 * Utility function to get appropriate duration based on reduced motion preference
 * @param standardDuration - The standard duration in milliseconds
 * @param reducedMotionDuration - The duration to use when reduced motion is preferred
 * @returns Appropriate duration based on user preference
 */
export const getDurationForMotionPreference = (
  standardDuration: number = 300,
  reducedMotionDuration: number = 0
): number => {
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? reducedMotionDuration : standardDuration;
  }
  return standardDuration;
};