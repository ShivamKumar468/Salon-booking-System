'use client';

import React from 'react';
import Link from 'next/link';
import Card3D from '../../../components/ui/Card3D';
import { Users, Heart, Sparkles } from 'lucide-react';
import PageTransition from '../../../components/animations/PageTransition';

const team = [
  { name: 'Alex Morgan', role: 'Founder & CEO', color: 'rgba(255, 51, 102, 0.15)' },
  { name: 'Jamie Lee', role: 'Head Stylist', color: 'rgba(139, 92, 246, 0.15)' },
  { name: 'Chris Wong', role: 'Tech Lead', color: 'rgba(6, 182, 212, 0.15)' },
];

export default function AboutPage() {
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
              <button className="py-2 px-4 text-xs font-bold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                Join Sanctuary
              </button>
            </Link>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">About Lumina</h1>
            <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
              We&apos;re revolutionizing the salon experience with AI-powered personalization and immersive technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card3D glowColor="rgba(255, 51, 102, 0.15)" className="border border-white/5 bg-zinc-900/40 p-8 text-center">
              <div className="p-4 bg-white/5 border border-white/5 text-rose-400 rounded-2xl w-fit mx-auto mb-4">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-200 mb-2">AI Innovation</h3>
              <p className="text-zinc-400">Cutting-edge AI for personalized recommendations</p>
            </Card3D>

            <Card3D glowColor="rgba(139, 92, 246, 0.15)" className="border border-white/5 bg-zinc-900/40 p-8 text-center">
              <div className="p-4 bg-white/5 border border-white/5 text-violet-400 rounded-2xl w-fit mx-auto mb-4">
                <Users className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-200 mb-2">Expert Team</h3>
              <p className="text-zinc-400">Award-winning stylists with decades of experience</p>
            </Card3D>

            <Card3D glowColor="rgba(6, 182, 212, 0.15)" className="border border-white/5 bg-zinc-900/40 p-8 text-center">
              <div className="p-4 bg-white/5 border border-white/5 text-cyan-400 rounded-2xl w-fit mx-auto mb-4">
                <Heart className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-200 mb-2">Premium Care</h3>
              <p className="text-zinc-400">Luxurious experience tailored to your needs</p>
            </Card3D>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-zinc-100 mb-4">Our Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <Card3D key={i} glowColor={member.color} className="border border-white/5 bg-zinc-900/40 p-8 text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-400 to-violet-500 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">{member.name.charAt(0)}</span>
                </div>
                <h3 className="text-xl font-bold text-zinc-200">{member.name}</h3>
                <p className="text-zinc-400">{member.role}</p>
              </Card3D>
            ))}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
