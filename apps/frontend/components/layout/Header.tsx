'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../hooks/useAuth';
import { LogOut, User, Bell, ChevronDown, Calendar, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Fallback default avatar
  const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="40" height="40">
      <rect width="100" height="100" rx="20" fill="#27272a"/>
      <circle cx="50" cy="40" r="14" fill="#a1a1aa"/>
      <path d="M25,80 Q50,55 75,80" fill="#a1a1aa"/>
    </svg>
  `)}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-zinc-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between">
      {/* Top-Left: User Avatar and Quick Info */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-xl bg-white/5 border border-white/5 hover:border-rose-500/30 transition-all cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={user.avatarUrl || defaultAvatar}
                alt={user.name}
                className="w-9 h-9 rounded-lg object-cover"
              />
              <span className="hidden sm:inline text-sm font-semibold text-zinc-200 pr-1">
                {user.name}
              </span>
              <ChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDropdownOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 mt-2 w-48 rounded-xl bg-zinc-900 border border-white/5 p-1.5 shadow-2xl z-20"
                  >
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors decoration-none"
                    >
                      <User className="w-4 h-4 text-rose-400" />
                      View Profile
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors decoration-none"
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-400" />
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors decoration-none"
                    >
                      <Calendar className="w-4 h-4 text-violet-400" />
                      My Bookings
                    </Link>
                    <hr className="border-white/5 my-1.5" />
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 text-zinc-300 hover:text-white text-sm font-semibold transition-colors"
          >
            <User className="w-5 h-5" />
            Login
          </Link>
        )}
      </div>

      {/* Center: Branding */}
      <Link href="/dashboard" className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-violet-500 hover:opacity-95 transition-opacity decoration-none">
        LUMINA
      </Link>

      {/* Right-Side: Quick Actions */}
      <div className="flex items-center gap-4">
        {user && (
          <>
            {/* Notifications Icon (Mock) */}
            <button className="text-zinc-400 hover:text-rose-400 p-2 rounded-xl hover:bg-white/5 transition-all relative cursor-pointer">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            
            <Link href="/booking" className="hidden sm:block">
              <button className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs tracking-wider uppercase px-4 py-2 rounded-xl transition-all cursor-pointer border border-white/10 hover:shadow-[0_0_15px_rgba(255,51,102,0.3)]">
                Book Session
              </button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
