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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Link href="/">
                <h1 className="text-xl font-semibold text-foreground">Todo App</h1>
              </Link>
            </div>
            <nav className="flex space-x-4">
              <Link
                href="/auth/login"
                className="text-sm font-medium text-foreground hover:text-primary px-3 py-2 rounded-md"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm font-medium text-white bg-primary hover:bg-primary/90 px-3 py-2 rounded-md"
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
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              <span className="block">Manage Your Tasks</span>
              <span className="block bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mt-2">Effortlessly</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              A secure and intuitive todo application to help you stay organized and productive.
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
      <footer className="bg-background/80 backdrop-blur-sm border-t border-border/40">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Todo App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
