'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import Input3D from '../../../components/ui/Input3D';
import Button3D from '../../../components/ui/Button3D';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/animations/PageTransition';
import useNotificationStore from '../../../stores/notificationStore';

export default function ForgotPasswordPage() {
  const addToast = useNotificationStore((state) => state.addToast);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your email', 'error');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      addToast('Password reset link sent to your email!', 'success');
    }, 1500);
  };

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center px-4 py-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black pointer-events-none -z-10" />

        <div className="w-full max-w-md">
          {/* Logo Brand Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-violet-500">
              LUMINA
            </h1>
            <p className="text-zinc-500 text-sm tracking-widest mt-2 uppercase">
              AI-Powered Sanctuary of Beauty
            </p>
          </div>

          <Card3D glowColor="rgba(255, 51, 102, 0.1)">
            <h2 className="text-2xl font-bold tracking-wide text-zinc-100 mb-2">
              Recover Password
            </h2>
            
            {isSent ? (
              <div className="space-y-6 mt-4">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm text-center">
                  Check your inbox! We&apos;ve sent a password reset token to <strong className="text-zinc-100">{email}</strong>.
                </div>
                <Link href="/login" className="block">
                  <Button3D fullWidth variant="secondary">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button3D>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 mt-4">
                <p className="text-zinc-400 text-sm">
                  Enter the email address associated with your profile, and we will send you recovery instructions.
                </p>

                <Input3D
                  label="Email Address"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />

                <Button3D type="submit" fullWidth disabled={isLoading} variant="primary">
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" />
                      Send Reset Instructions
                    </span>
                  )}
                </Button3D>

                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-zinc-400 hover:text-zinc-200 text-sm font-semibold transition-colors decoration-none"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1.5" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </Card3D>
        </div>
      </div>
    </PageTransition>
  );
}
