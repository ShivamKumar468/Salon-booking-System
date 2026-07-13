'use client';

import React from 'react';
import Link from 'next/link';
import Card3D from '../../../components/ui/Card3D';
import Button3D from '../../../components/ui/Button3D';
import { Camera, Palette, Sparkles } from 'lucide-react';
import PageTransition from '../../../components/animations/PageTransition';

export default function TryOnPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-zinc-950">
        {/* Navbar */}
        <nav className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
          <Link href="/" className="text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-500 decoration-none">
            LUMINA
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-zinc-400 hover:text-zinc-100 text-sm font-semibold transition-colors decoration-none">
              Login
            </Link>
            <Link href="/register" className="decoration-none">
              <Button3D variant="primary" className="py-2 px-4 text-xs font-bold">
                Join Sanctuary
              </Button3D>
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">AR Hair Try-On</h1>
            <p className="text-zinc-400 text-lg">Visualize your new look before you book</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card3D glowColor="rgba(139, 92, 246, 0.15)" className="border border-white/5 bg-zinc-900/40 p-8 min-h-[500px] flex flex-col items-center justify-center">
              <div className="w-full aspect-video bg-zinc-800/50 rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center">
                <Camera className="w-16 h-16 text-zinc-600 mb-4" />
                <p className="text-zinc-500 text-center">Camera preview will appear here</p>
                <p className="text-zinc-600 text-sm mt-2">Allow camera access to start</p>
              </div>
              <Button3D variant="primary" className="mt-6">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button3D>
            </Card3D>

            <div className="space-y-6">
              <Card3D glowColor="rgba(255, 51, 102, 0.15)" className="border border-white/5 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-rose-400" />
                  Hair Colors
                </h3>
                <div className="grid grid-cols-4 gap-3">
                  {['#1a1a1a', '#4a3728', '#8b5a2b', '#d4a574', '#ffd700', '#ff6b6b', '#6b5b95', '#00bfff'].map((color, i) => (
                    <button
                      key={i}
                      className="w-full aspect-square rounded-xl border-2 border-white/10 hover:border-rose-400 transition-all"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </Card3D>

              <Card3D glowColor="rgba(6, 182, 212, 0.15)" className="border border-white/5 bg-zinc-900/40 p-6">
                <h3 className="text-lg font-bold text-zinc-200 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  Hair Styles
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {['Long', 'Short', 'Bob', 'Layered'].map((style, i) => (
                    <Button3D key={i} variant="secondary" className="w-full">
                      {style}
                    </Button3D>
                  ))}
                </div>
              </Card3D>
            </div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
