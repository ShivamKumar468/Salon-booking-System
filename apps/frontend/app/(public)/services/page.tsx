import React from 'react';
import Link from 'next/link';
import Card3D from '../../../components/ui/Card3D';
import Button3D from '../../../components/ui/Button3D';
import { Scissors, Palette, Sparkles, Bath } from 'lucide-react';
import PageTransition from '../../../components/animations/PageTransition';
import prisma from '../../../lib/prisma';

const iconMap: Record<string, React.ElementType> = {
  Haircut: Scissors,
  Coloring: Palette,
  Keratin: Sparkles,
  Facial: Bath,
  Skin: Bath,
  Hair: Scissors,
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany();

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
            <h1 className="text-4xl sm:text-5xl font-extrabold text-zinc-100 mb-4">Our Services</h1>
            <p className="text-zinc-400 text-lg">Discover our premium salon services curated just for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => {
              const Icon = iconMap[service.category] || Scissors;
              const color = service.category === 'Hair' ? 'rgba(255, 51, 102, 0.15)' : 'rgba(34, 197, 94, 0.15)';
              return (
                <Card3D key={service.id} glowColor={color} className="border border-white/5 bg-zinc-900/40 p-6 flex flex-col">
                  <div className="p-3 bg-white/5 border border-white/5 text-rose-400 rounded-xl w-fit mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-zinc-200 mb-2">{service.name}</h3>
                  <p className="text-zinc-400 text-sm mb-4 flex-grow">{service.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-rose-400 font-bold">${service.price}</span>
                    <span className="text-zinc-500 text-sm">{service.duration} min</span>
                  </div>
                  <Button3D variant="secondary" className="w-full">
                    Book Now
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
