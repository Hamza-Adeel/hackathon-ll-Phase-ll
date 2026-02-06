'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isMounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }

    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.setAttribute('data-theme', theme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(theme);
      localStorage.setItem('theme', theme);
    }
  }, [theme, isMounted]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (!isMounted) {
    return <div className="hidden">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isMounted }}>
      <div
        data-theme={theme}
        className={`min-h-screen transition-colors duration-500
        ${theme === 'dark'
            ? 'bg-gradient-to-br from-[#0f0f1a] via-[#121225] to-[#0b0b14] text-gray-100'
            : 'bg-gradient-to-br from-[#f8fafc] via-[#eef2ff] to-[#e0e7ff] text-gray-900'
          }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="relative p-3 rounded-2xl 
      backdrop-blur-md
      border border-white/10
      bg-white/5
      hover:bg-white/10
      dark:bg-white/5
      transition-all duration-300
      shadow-[0_0_20px_rgba(139,92,246,0.25)]
      hover:shadow-[0_0_30px_rgba(99,102,241,0.45)]
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      focus:ring-offset-2
      focus:ring-offset-transparent"
    >
      <div className="relative flex items-center justify-center">
        {theme === 'light' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-indigo-600 transition-all duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-400 transition-all duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
          </svg>
        )}
      </div>
    </button>
  );
};
