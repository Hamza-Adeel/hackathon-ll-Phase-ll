'use client';

import React, { useState } from 'react';
import { useAuth } from '../providers/auth-provider';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { GlassInput } from '@/src/components/ui/glass-input';
import { motion } from 'framer-motion';

export const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      router.push('/'); // Redirect after login
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <GlassCard variant="elevated" className="py-8 px-6 sm:px-10">
        <h2 className="text-2xl font-bold text-foreground mb-6">Sign in to your account</h2>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-4 text-destructive bg-destructive/10 p-3 rounded-xl border border-destructive/20"
          >
            {error}
          </motion.div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <GlassInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
          />

          <GlassInput
            label="Password"
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-sm text-foreground">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <span>Remember me</span>
            </label>

            <a href="/auth/forgot-password" className="font-medium text-primary hover:text-primary/80 text-sm">
              Forgot your password?
            </a>
          </div>

          <GradientButton
            type="submit"
            className="w-full"
            disabled={loading}
            variant="primary"
            animate={true}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </GradientButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="/auth/signup" className="font-medium text-primary hover:text-primary/80">
            Sign up
          </a>
        </p>
      </GlassCard>
    </motion.div>
  );
};
