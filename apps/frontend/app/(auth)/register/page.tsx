'use client';

import React from 'react';
import Link from 'next/link';
import RegisterForm from '../../../components/auth/RegisterForm';
import Card3D from '../../../components/ui/Card3D';
import PageTransition from '../../../components/animations/PageTransition';

export default function RegisterPage() {
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

          {/* Interactive 3D Register Box */}
          <Card3D glowColor="rgba(139, 92, 246, 0.1)">
            <h2 className="text-2xl font-bold tracking-wide text-zinc-100 mb-2">
              Create Profile
            </h2>
            <p className="text-zinc-400 text-sm mb-6">
              Join us to unlock personalized skin & hair diagnostics.
            </p>

            <RegisterForm />

            <div className="text-center mt-6">
              <p className="text-zinc-500 text-sm">
                Already have an account?{' '}
                <Link
                  href="/login"
                  className="text-rose-400 hover:text-rose-300 font-semibold transition-colors decoration-none"
                >
                  Log in
                </Link>
              </p>
            </div>
          </Card3D>
        </div>
      </div>
    </PageTransition>
  );
}
