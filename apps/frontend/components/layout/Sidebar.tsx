'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calendar, Sparkles, User, Settings, ShieldCheck } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Book Session', href: '/booking', icon: Calendar },
    { name: 'My Bookings', href: '/my-bookings', icon: Sparkles },
    { name: 'My Profile', href: '/profile', icon: User },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ name: 'Admin Panel', href: '/admin', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 border-r border-white/5 bg-zinc-950/20 px-4 py-8 hidden md:flex flex-col gap-6 h-[calc(100vh-73px)] sticky top-[73px]">
      <div className="text-zinc-600 text-xs font-bold tracking-widest uppercase pl-3 mb-2">
        Sanctuary Menu
      </div>
      <nav className="flex flex-col gap-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all duration-300 group decoration-none ${
                isActive
                  ? 'bg-rose-600/10 text-rose-400 border border-rose-500/20 shadow-[0_0_15px_rgba(255,51,102,0.05)]'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                isActive ? 'text-rose-400' : 'text-zinc-500 group-hover:text-rose-400'
              }`} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      {/* Decorative Diagnostic Banner */}
      <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 to-fuchsia-950/30 border border-violet-500/10 flex flex-col gap-2 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/10 rounded-full filter blur-xl pointer-events-none" />
        <h4 className="text-zinc-200 text-xs font-bold tracking-wide">AI Diagnostics</h4>
        <p className="text-zinc-500 text-[10px] leading-relaxed">
          Skin & hair scanning agents will be fully unlocked in Phase 2.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
