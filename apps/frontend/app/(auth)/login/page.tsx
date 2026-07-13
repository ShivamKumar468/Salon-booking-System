'use client';

import React from 'react';
import Link from 'next/link';
import LoginForm from '../../../components/auth/LoginForm';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/animations/PageTransition';

export default function LoginPage() {
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

          {/* Interactive 3D Login Box */}
          <Card3D glowColor="rgba(255, 51, 102, 0.1)">
            <h2 className="text-2xl font-bold tracking-wide text-zinc-100 mb-2">
              Welcome Back
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Enter your credentials to enter the salon portal.
            </p>

            <LoginForm />

            <div className="text-center mt-6">
              <p className="text-zinc-500 text-sm">
                New to Lumina?{' '}
                <Link
                  href="/register"
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors decoration-none"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </Card3D>
        </div>
      </div>
    </PageTransition>
  );
}
