'use client';

import React from 'react';
import Link from 'next/link';
import Card3D from '../components/ui/Card3D';
import Button3D from '../components/ui/Button3D';
import { Sparkles, Calendar, Heart, Shield, ArrowRight } from 'lucide-react';
import PageTransition from '../components/animations/PageTransition';

export default function LandingPage() {
  const highlights = [
    {
      title: 'AI Diagnostic Consultation',
      description: 'Custom neural networks analyze hair density and skin oil levels to curate recommendations.',
      icon: Sparkles,
      color: 'rgba(255, 51, 102, 0.15)',
    },
    {
      title: 'AR Hair Try-On',
      description: 'Visualize custom coloring layers and length extensions instantly with immersive AR overlays.',
      icon: Heart,
      color: 'rgba(139, 92, 246, 0.15)',
    },
    {
      title: 'Sanctuary Preferences',
      description: 'Save your in-chair preferences including quiet time, beverage logs, and custom ambient soundtracks.',
      icon: Shield,
      color: 'rgba(6, 182, 212, 0.15)',
    },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen relative flex flex-col justify-between overflow-hidden">
        {/* Glow ambient backgrounds */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-black pointer-events-none -z-10" />

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

        {/* Hero Section */}
        <main className="max-w-6xl mx-auto px-6 py-20 flex-grow flex flex-col justify-center items-center text-center relative z-10 space-y-10">
          <div className="space-y-4 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              The Future of Beauty is Here
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-zinc-100 leading-tight">
              AI-Powered{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-violet-500">
                Salon Sanctuary
              </span>
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
              Welcome to Lumina. An immersive retreat combining neural skin & hair diagnostics with top-tier master stylists. Schedule your custom styling session today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="decoration-none">
              <Button3D variant="primary" className="hover:shadow-[0_0_20px_rgba(255,51,102,0.3)]">
                Book First Session
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button3D>
            </Link>
            <Link href="/stylists" className="decoration-none">
              <Button3D variant="secondary">
                <Calendar className="w-4 h-4 mr-1.5" />
                View Stylists
              </Button3D>
            </Link>
          </div>

          {/* Highlight Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full pt-16 text-left">
            {highlights.map((hl) => {
              const Icon = hl.icon;
              return (
                <Card3D key={hl.title} glowColor={hl.color} className="border border-white/5 bg-zinc-900/40 p-6 flex flex-col justify-between">
                  <div>
                    <div className="p-3 bg-white/5 border border-white/5 text-rose-400 rounded-xl w-fit mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-200 mb-2">{hl.title}</h3>
                    <p className="text-zinc-400 text-xs leading-relaxed">{hl.description}</p>
                  </div>
                </Card3D>
              );
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full max-w-6xl mx-auto px-6 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-zinc-600 text-xs gap-4">
          <div>
            &copy; {new Date().getFullYear()} LUMINA. Made for futuristic self-care.
          </div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-zinc-400 transition-colors">Instagram</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">TikTok</a>
            <a href="#" className="hover:text-zinc-400 transition-colors">About Us</a>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
}
