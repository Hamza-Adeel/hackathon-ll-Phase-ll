/**
 * Animation utility functions for the visual design system
 * Optimized for GPU-accelerated properties (transform, opacity)
 */

// Define common animation presets - these are kept as the original version with hyphenated names for compatibility
export const animationPresetsOriginal = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-up': {
    initial: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-down': {
    initial: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-left': {
    initial: { opacity: 0, x: -20, transform: 'translate3d(-20px, 0, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, x: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, x: -20, transform: 'translate3d(-20px, 0, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-right': {
    initial: { opacity: 0, x: 20, transform: 'translate3d(20px, 0, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, x: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, x: 20, transform: 'translate3d(20px, 0, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'scale-in': {
    initial: { opacity: 0, scale: 0.95, transform: 'scale3d(0.95, 0.95, 1)' }, // GPU-accelerated transform
    animate: { opacity: 1, scale: 1, transform: 'scale3d(1, 1, 1)' },
    exit: { opacity: 0, scale: 0.95, transform: 'scale3d(0.95, 0.95, 1)' },
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  bounce: {
    animate: {
      y: [0, -10, 0],
      transform: ['translate3d(0, 0, 0)', 'translate3d(0, -10px, 0)', 'translate3d(0, 0, 0)'], // GPU-accelerated transform
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        times: [0, 0.5, 1]
      }
    }
  }
};

// Animation variants for different states
export const hoverVariants = {
  default: {
    scale: 1.03,
    transform: 'scale3d(1.03, 1.03, 1)', // GPU-accelerated transform
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  elevated: {
    scale: 1.05,
    transform: 'scale3d(1.05, 1.05, 1)', // GPU-accelerated transform
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  pressed: {
    scale: 0.98,
    transform: 'scale3d(0.98, 0.98, 1)', // GPU-accelerated transform
    transition: { duration: 0.1, ease: 'easeOut' }
  }
};

// Focus animation variants
export const focusVariants = {
  default: {
    // Using transform instead of boxShadow for GPU acceleration where possible
    transition: { duration: 0.2 }
  },
  error: {
    transition: { duration: 0.2 }
  },
  success: {
    transition: { duration: 0.2 }
  }
};

// Animation easing functions
export const easingFunctions = {
  standard: 'easeInOut',
  emphasized: 'easeOut',
  deceleration: 'easeOut', // Ease out
  acceleration: 'easeIn'   // Ease in
};

// Animation duration presets
export const durationPresets = {
  fast: 150,    // ms
  normal: 300,  // ms
  slow: 500     // ms
};

// Utility function to create staggered animations
export const createStagger = (staggerAmount: number = 0.05) => ({
  animate: {
    transition: {
      staggerChildren: staggerAmount,
      delayChildren: 0.1
    }
  }
});

export const staggerChildren = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// Animation helper for page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' }, // GPU-accelerated transform
  animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
  exit: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' },
  transition: { duration: 0.4, ease: easingFunctions.standard }
};

// Animation helper for modal transitions
export const modalTransition = {
  initial: { opacity: 0, scale: 0.95, y: 20, transform: 'translate3d(0, 20px, 0) scale3d(0.95, 0.95, 1)' }, // GPU-accelerated transforms
  animate: { opacity: 1, scale: 1, y: 0, transform: 'translate3d(0, 0, 0) scale3d(1, 1, 1)' },
  exit: { opacity: 0, scale: 0.95, y: 20, transform: 'translate3d(0, 20px, 0) scale3d(0.95, 0.95, 1)' },
  transition: {
    duration: 0.3,
    ease: easingFunctions.standard
  }
};

// Animation helper for tooltip transitions
export const tooltipTransition = {
  initial: { opacity: 0, scale: 0.8, transform: 'scale3d(0.8, 0.8, 1)' }, // GPU-accelerated transform
  animate: { opacity: 1, scale: 1, transform: 'scale3d(1, 1, 1)' },
  exit: { opacity: 0, scale: 0.8, transform: 'scale3d(0.8, 0.8, 1)' },
  transition: {
    duration: 0.15,
    ease: easingFunctions.acceleration
  }
};

// Function to get animation props based on reduced motion preference
export const getAnimationProps = (defaultProps: any) => {
  if (typeof window !== 'undefined') {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return prefersReducedMotion ? {
      initial: { opacity: 1 },
      animate: { opacity: 1 },
      exit: { opacity: 1 },
      transition: { duration: 0 }
    } : defaultProps;
  }
  return defaultProps;
};

// Optimized animation properties that use GPU-accelerated transforms
export const gpuAcceleratedAnimations = {
  // Properties that trigger GPU acceleration
  acceleratedProperties: ['transform', 'opacity'],

  // Common optimized animations
  slideIn: (direction: 'up' | 'down' | 'left' | 'right' = 'up', distance: number = 20) => {
    let translateX = 0;
    let translateY = 0;

    switch(direction) {
      case 'up': translateY = distance; break;
      case 'down': translateY = -distance; break;
      case 'left': translateX = distance; break;
      case 'right': translateX = -distance; break;
    }

    return {
      initial: {
        opacity: 0,
        transform: `translate3d(${translateX}px, ${translateY}px, 0)` // GPU-accelerated
      },
      animate: {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)' // GPU-accelerated
      },
      exit: {
        opacity: 0,
        transform: `translate3d(${translateX}px, ${translateY}px, 0)` // GPU-accelerated
      }
    };
  },

  fadeIn: (delay: number = 0) => ({
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { delay }
    },
    exit: { opacity: 0 }
  }),

  scaleIn: (scaleFactor: number = 0.95) => ({
    initial: {
      opacity: 0,
      transform: `scale3d(${scaleFactor}, ${scaleFactor}, 1)` // GPU-accelerated
    },
    animate: {
      opacity: 1,
      transform: 'scale3d(1, 1, 1)' // GPU-accelerated
    },
    exit: {
      opacity: 0,
      transform: `scale3d(${scaleFactor}, ${scaleFactor}, 1)` // GPU-accelerated
    }
  })
};

// Animation presets for transitions component - with hyphenated names as expected
export const animationPresets = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-up': {
    initial: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-down': {
    initial: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-left': {
    initial: { opacity: 0, x: -20, transform: 'translate3d(-20px, 0, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, x: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, x: -20, transform: 'translate3d(-20px, 0, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'slide-right': {
    initial: { opacity: 0, x: 20, transform: 'translate3d(20px, 0, 0)' }, // GPU-accelerated transform
    animate: { opacity: 1, x: 0, transform: 'translate3d(0, 0, 0)' },
    exit: { opacity: 0, x: 20, transform: 'translate3d(20px, 0, 0)' },
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  'scale-in': {
    initial: { opacity: 0, scale: 0.95, transform: 'scale3d(0.95, 0.95, 1)' }, // GPU-accelerated transform
    animate: { opacity: 1, scale: 1, transform: 'scale3d(1, 1, 1)' },
    exit: { opacity: 0, scale: 0.95, transform: 'scale3d(0.95, 0.95, 1)' },
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  bounce: {
    animate: {
      y: [0, -10, 0],
      transform: ['translate3d(0, 0, 0)', 'translate3d(0, -10px, 0)', 'translate3d(0, 0, 0)'], // GPU-accelerated transform
      transition: {
        duration: 0.6,
        ease: 'easeInOut',
        times: [0, 0.5, 1]
      }
    }
  }
};

// Reusable animation presets for other components
export const reusableAnimationPresets = {
  // Entry animations
  entrance: {
    hidden: { opacity: 0, y: 20, transition: { duration: 0 } },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: easingFunctions.standard
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: easingFunctions.standard
      }
    }
  },

  // Fade animations
  fade: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: easingFunctions.standard
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.2,
        ease: easingFunctions.standard
      }
    }
  },

  // Scale animations
  scale: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: easingFunctions.emphasized
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.2,
        ease: easingFunctions.emphasized
      }
    }
  },

  // Slide animations
  slide: {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: easingFunctions.standard
      }
    },
    exit: {
      opacity: 0,
      x: 20,
      transition: {
        duration: 0.2,
        ease: easingFunctions.standard
      }
    }
  },

  // Stagger animations
  stagger: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  },

  // Hover animations
  hover: {
    rest: {
      scale: 1,
      transition: { duration: 0.2, ease: easingFunctions.standard }
    },
    hover: {
      scale: 1.03,
      transition: { duration: 0.2, ease: easingFunctions.emphasized }
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1, ease: easingFunctions.standard }
    }
  },

  // Pulse animations
  pulse: {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  },

  // Bounce animations
  bounce: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
        times: [0, 0.5, 1]
      }
    }
  }
};

// Animation duration presets in milliseconds
export const ANIMATION_DURATIONS = {
  instant: 0,
  fast: 150,
  normal: 300,
  slow: 500,
  extraSlow: 800
} as const;

// Animation easing presets
export const ANIMATION_EASINGS = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
  easeInBack: [0.68, -0.55, 0.27, 1.55],
  easeOutBack: [0.34, 1.56, 0.64, 1],
  easeInOutBack: [0.68, -0.55, 0.265, 1.55]
} as const;