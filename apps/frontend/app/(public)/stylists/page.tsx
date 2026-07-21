import React from 'react';
import Link from 'next/link';
import Card3D from '../../../components/ui/Card3D';
import Button3D from '../../../components/ui/Button3D';
import { Star } from 'lucide-react';
import PageTransition from '../../../components/animations/PageTransition';
import Avvvatars from 'avvvatars-react';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function StylistsPage() {
  const stylists = await prisma.stylist.findMany({ include: { user: true } });

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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">Our Stylists</h1>
            <p className="text-zinc-400 text-lg">Meet our team of award-winning master stylists</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stylists.map((stylist) => {
              const specialities = stylist.specialities ? stylist.specialities.split(',') : [];
              return (
                <Card3D key={stylist.id} glowColor="rgba(255, 51, 102, 0.15)" className="border border-white/5 bg-zinc-900/40 p-6 flex flex-col items-center text-center">
                  <Avvvatars value={stylist.user.name || 'User'} style="shape" size={100} />
                  <h3 className="text-xl font-bold text-zinc-200 mt-4 mb-2">{stylist.user.name}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-zinc-300 font-semibold">{stylist.rating}</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">{stylist.bio}</p>
                  <div className="flex flex-wrap gap-2 mb-4 justify-center">
                    {specialities.map((spec, i) => (
                      <span key={i} className="px-3 py-1 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-full border border-rose-500/20">
                        {spec}
                      </span>
                    ))}
                  </div>
                  <Button3D variant="secondary" className="w-full">
                    View Profile
                  </Button3D>
                </Card3D>
              );
            })}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}
