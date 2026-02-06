import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '../../lib/utils/accessibility';

interface AuthTransitionProps {
  children: React.ReactNode;
  isActive?: boolean;
  type?: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'scale';
  className?: string;
}

export const AuthTransition: React.FC<AuthTransitionProps> = ({
  children,
  isActive = true,
  type = 'fade',
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  // Define animation variants based on type
  const getAnimationVariants = () => {
    if (reducedMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 }
      };
    }

    switch (type) {
      case 'slide-up':
        return {
          initial: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' },
          animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
          exit: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' },
          transition: { duration: 0.4, ease: 'easeInOut' }
        }as const;

      case 'slide-down':
        return {
          initial: { opacity: 0, y: -20, transform: 'translate3d(0, -20px, 0)' },
          animate: { opacity: 1, y: 0, transform: 'translate3d(0, 0, 0)' },
          exit: { opacity: 0, y: 20, transform: 'translate3d(0, 20px, 0)' },
          transition: { duration: 0.4, ease: 'easeInOut' }
        }as const;

      case 'zoom':
        return {
          initial: { opacity: 0, scale: 0.9, transform: 'scale3d(0.9, 0.9, 1)' },
          animate: { opacity: 1, scale: 1, transform: 'scale3d(1, 1, 1)' },
          exit: { opacity: 0, scale: 0.95, transform: 'scale3d(0.95, 0.95, 1)' },
          transition: { duration: 0.4, ease: 'easeInOut' }
        }as const;

      case 'scale':
        return {
          initial: { opacity: 0, scale: 0.8, transform: 'scale3d(0.8, 0.8, 1)' },
          animate: { opacity: 1, scale: 1, transform: 'scale3d(1, 1, 1)' },
          exit: { opacity: 0, scale: 0.8, transform: 'scale3d(0.8, 0.8, 1)' },
          transition: { duration: 0.3, ease: 'easeInOut' }
        }as const;

      case 'fade':
      default:
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.3, ease: 'easeInOut' }
        }as const;
    }
  };

  const variants = getAnimationVariants();

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={variants.transition}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface AuthViewTransitionProps {
  isAuthenticated: boolean;
  authView: React.ReactNode;
  appView: React.ReactNode;
  className?: string;
}

export const AuthViewTransition: React.FC<AuthViewTransitionProps> = ({
  isAuthenticated,
  authView,
  appView,
  className = ''
}) => {
  return (
    <div className={className}>
      <AuthTransition isActive={!isAuthenticated} type="slide-up">
        {authView}
      </AuthTransition>
      <AuthTransition isActive={isAuthenticated} type="slide-down">
        {appView}
      </AuthTransition>
    </div>
  );
};

// Specific transitions for auth flows
export const LoginTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <AuthTransition type="fade" className={className}>
    {children}
  </AuthTransition>
);

export const SignupTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <AuthTransition type="zoom" className={className}>
    {children}
  </AuthTransition>
);

export const LogoutTransition: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <AuthTransition type="scale" className={className}>
    {children}
  </AuthTransition>
);

// Loading transition for auth state changes
interface AuthLoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export const AuthLoadingTransition: React.FC<AuthLoadingTransitionProps> = ({
  isLoading,
  children,
  className = ''
}) => {
  const reducedMotion = useReducedMotion();

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-300 ${className}`}>
        <motion.div
          animate={reducedMotion ? {} : { rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear" as const
          }}
        >
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <AuthTransition type="fade" className={className}>
      {children}
    </AuthTransition>
  );
};

// Hook for managing auth transitions
export const useAuthTransition = () => {
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [authState, setAuthState] = React.useState<'idle' | 'logging-in' | 'signing-up' | 'logging-out'>('idle');

  const startLogin = () => {
    setIsTransitioning(true);
    setAuthState('logging-in');
  };

  const startSignup = () => {
    setIsTransitioning(true);
    setAuthState('signing-up');
  };

  const startLogout = () => {
    setIsTransitioning(true);
    setAuthState('logging-out');
  };

  const endTransition = () => {
    setIsTransitioning(false);
    setAuthState('idle');
  };

  return {
    isTransitioning,
    authState,
    startLogin,
    startSignup,
    startLogout,
    endTransition
  };
};