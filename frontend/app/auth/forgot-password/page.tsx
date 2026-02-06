'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { GlassInput } from '@/src/components/ui/glass-input';
import { motion } from 'framer-motion';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('If this email exists in our system, you will receive a reset link shortly.');
        setEmail('');
      } else {
        toast.error(data.detail || 'Failed to send reset link. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    >
      <GlassCard variant="elevated" className="py-8 px-6 sm:px-10 max-w-md w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Forgot your password?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <GlassInput
              label="Email address"
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <GradientButton
              type="submit"
              className="w-full"
              disabled={loading}
              variant="primary"
              animate={true}
            >
              {loading ? 'Sending...' : 'Reset password'}
            </GradientButton>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <a href="/auth/login" className="font-medium text-primary hover:text-primary/80">
              Back to sign in
            </a>
          </div>
        </form>
      </GlassCard>
    </motion.div>
  );
};

export default ForgotPasswordPage;