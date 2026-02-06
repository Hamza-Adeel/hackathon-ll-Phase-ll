'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'floating';
  animate?: boolean;
  delay?: number;
}

export const GlassCard = ({
  children,
  className = '',
  variant = 'default',
  animate = true,
  delay = 0
}: GlassCardProps) => {
  const baseClasses = "rounded-2xl border bg-background/60 backdrop-blur-lg border-border/40 shadow-lg";

  const variantClasses = {
    default: "p-6",
    elevated: "p-6 shadow-xl",
    floating: "p-6 shadow-2xl"
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay,
          ease: "easeOut"
        }}
        className={combinedClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={combinedClasses}>
      {children}
    </div>
  );
};