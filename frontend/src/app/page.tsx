'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/providers/auth-provider';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/protected/dashboard');
      }
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg-primary))] flex flex-col text-[rgb(var(--color-text-primary))] transition-colors duration-300">

      {/* Header */}
      <header className="bg-[rgb(var(--color-bg-secondary))]/80 backdrop-blur-sm border-b border-[rgb(var(--color-text-muted))]/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl font-semibold text-[rgb(var(--color-text-primary))]">TaskFlow AI</h1>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-primary-start))] px-3 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-white bg-gradient-to-r from-[rgb(var(--color-primary-start))] to-[rgb(var(--color-primary-end))] hover:opacity-90 px-3 py-2 rounded-md transition-all"
              >
                Sign Up
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="grow flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block text-[rgb(var(--color-text-primary))]">Manage Your Tasks</span>
              <span className="block bg-gradient-to-r from-[rgb(var(--color-primary-start))] to-[rgb(var(--color-secondary-end))] bg-clip-text text-transparent mt-2">
                Effortlessly
              </span>
            </h1>

            <p className="mt-3 max-w-md mx-auto text-base text-[rgb(var(--color-text-muted))] sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A secure and intelligent task manager to help you stay organized and productive.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <GradientButton
                variant="primary"
                animate={true}
              >
                <a href="/auth/signup">
                  Get Started
                </a>
              </GradientButton>

              <GradientButton
                variant="secondary"
                animate={true}
              >
                <a href="/auth/login">
                  Sign In
                </a>
              </GradientButton>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[rgb(var(--color-bg-secondary))]/80 backdrop-blur-sm border-t border-[rgb(var(--color-text-muted))]/40">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[rgb(var(--color-text-muted))]">
            © {new Date().getFullYear()} TaskFlow AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
