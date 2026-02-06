'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../components/providers/auth-provider';
import { toast } from 'sonner';
import { GlassCard } from '@/src/components/ui/glass-card';
import { GradientButton } from '@/src/components/ui/gradient-button';
import { GlassInput } from '@/src/components/ui/glass-input';
import { motion } from 'framer-motion';

const ProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingChange, setLoadingChange] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }

    setLoadingChange(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully!');
        // Reset form
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowChangePasswordModal(false);
      } else {
        toast.error(data.detail || 'Failed to change password. Please try again.');
      }
    } catch (error) {
      console.error('Change password error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoadingChange(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-4 py-6 sm:px-0"
      >
        <h1 className="text-2xl font-bold text-foreground mb-6">Profile</h1>

        <GlassCard variant="elevated" className="p-6 mb-6">
          <h3 className="text-lg leading-6 font-medium text-foreground mb-4">Personal Information</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground mb-6">Your personal details and account information.</p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:space-y-0 sm:space-x-4">
              <dt className="text-sm font-medium text-muted-foreground mb-1 sm:mb-0">Full name</dt>
              <dd className="text-sm text-foreground sm:text-right">{user?.name || 'Not provided'}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:space-y-0 sm:space-x-4">
              <dt className="text-sm font-medium text-muted-foreground mb-1 sm:mb-0">Email address</dt>
              <dd className="text-sm text-foreground sm:text-right">{user?.email}</dd>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:space-y-0 sm:space-x-4">
              <dt className="text-sm font-medium text-muted-foreground mb-1 sm:mb-0">Account created</dt>
              <dd className="text-sm text-foreground sm:text-right">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
              </dd>
            </div>
          </div>
        </GlassCard>

        <GlassCard variant="elevated" className="p-6">
          <h3 className="text-lg leading-6 font-medium text-foreground mb-4">Security</h3>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground mb-6">Change your password and manage security settings.</p>

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
            <dt className="text-sm font-medium text-muted-foreground mb-2 sm:mb-0">Password</dt>
            <dd className="sm:text-right">
              <GradientButton
                onClick={() => setShowChangePasswordModal(true)}
                variant="secondary"
                animate={true}
              >
                Change Password
              </GradientButton>
            </dd>
          </div>
        </GlassCard>
      </motion.div>

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto p-6 rounded-xl glass max-w-md w-full"
          >
            <GlassCard variant="elevated" className="p-6">
              <h3 className="text-lg font-medium text-foreground mb-4">Change Password</h3>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <GlassInput
                    label="Current Password"
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Current password"
                    required
                  />
                </div>
                <div className="mb-4">
                  <GlassInput
                    label="New Password"
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    required
                  />
                </div>
                <div className="mb-6">
                  <GlassInput
                    label="Confirm New Password"
                    id="confirmNewPassword"
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <GradientButton
                    type="button"
                    onClick={() => setShowChangePasswordModal(false)}
                    variant="tertiary"
                    animate={true}
                  >
                    Cancel
                  </GradientButton>
                  <GradientButton
                    type="submit"
                    disabled={loadingChange}
                    variant="primary"
                    animate={true}
                  >
                    {loadingChange ? 'Changing...' : 'Change Password'}
                  </GradientButton>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;