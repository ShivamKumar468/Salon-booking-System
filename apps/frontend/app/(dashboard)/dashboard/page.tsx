'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuth from '../../../components/hooks/useAuth';
import Card3D from '../../../components/ui/Card3D';
import Button3D from '../../../components/ui/Button3D';
import Spinner3D from '../../../components/ui/Spinner3D';
import PageTransition from '../../../components/animations/PageTransition';
import { Calendar, Sparkles, Clock, MapPin, User, Star, ArrowRight, Settings } from 'lucide-react';
import useNotificationStore from '../../../stores/notificationStore';

interface Booking {
  id: string;
  dateTime: string;
  status: string;
  service: {
    name: string;
    duration: number;
    price: number;
  };
  stylist: {
    user: {
      name: string;
    };
  };
}

export default function DashboardPage() {
  const { user, token } = useAuth();
  const addToast = useNotificationStore((state) => state.addToast);
  const [nextBooking, setNextBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchNextBooking = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || '/api'}/bookings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          const now = new Date();
          const upcoming = data.bookings
            .filter((b: any) => new Date(b.dateTime) >= now && b.status !== 'CANCELLED')
            .sort((a: any, b: any) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

          if (upcoming.length > 0) {
            setNextBooking(upcoming[0]);
          }
        }
      } catch (err) {
        console.error('Fetch dashboard bookings error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNextBooking();
  }, [token]);

  if (loading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner3D />
      </div>
    );
  }

  const nextBookingDate = nextBooking ? new Date(nextBooking.dateTime) : null;

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Welcome Greeting Banner */}
        <div className="relative p-8 rounded-3xl overflow-hidden glass-panel border border-white/5 bg-gradient-to-r from-zinc-950/60 via-purple-950/20 to-zinc-950/60">
          <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/10 rounded-full filter blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-44 h-44 bg-violet-500/10 rounded-full filter blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-3">
            <span className="flex items-center gap-1 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 animate-pulse" />
              Welcome to the Sanctuary
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
              Good day, {user.name}
            </h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Step into Lumina. Ready for your next glow up? Check your upcoming sessions or schedule a custom styling treatment.
            </p>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Next Appointment Indicator Card */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-xl font-bold text-zinc-200 border-l-4 border-rose-500 pl-3">
              Next Session
            </h2>

            {nextBooking ? (
              <Card3D glowColor="rgba(255, 51, 102, 0.12)" className="border border-white/5 p-6 bg-zinc-900/40">
                <div className="space-y-6">
                  {/* Service info */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest block mb-1">
                        Upcoming Appointment
                      </span>
                      <h3 className="text-xl font-bold text-zinc-100">
                        {nextBooking.service.name}
                      </h3>
                      <p className="text-zinc-500 text-xs font-semibold mt-1">
                        With Master Stylist: {nextBooking.stylist.user.name}
                      </p>
                    </div>
                    <span className="text-2xl font-black text-rose-400">
                      ${nextBooking.service.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="w-full border-t border-white/5 my-4" />

                  {/* Date details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4.5 h-4.5 text-zinc-500" />
                      <div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Date</p>
                        <p className="text-zinc-300 text-xs font-bold">
                          {nextBookingDate?.toLocaleDateString([], {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-zinc-500" />
                      <div>
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Time</p>
                        <p className="text-zinc-300 text-xs font-bold">
                          {nextBookingDate?.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 flex justify-between items-center gap-4">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                      <MapPin className="w-4 h-4" />
                      Lumina Lounge &bull; Salon Floor
                    </div>
                    
                    <Link href="/my-bookings" className="decoration-none">
                      <Button3D variant="secondary" className="py-1.5 px-3 text-[10px] font-bold uppercase tracking-wider">
                        Manage Booking
                      </Button3D>
                    </Link>
                  </div>
                </div>
              </Card3D>
            ) : (
              <Card3D glowColor="rgba(255, 255, 255, 0.01)" className="p-8 text-center border border-dashed border-white/10 bg-zinc-950/20">
                <p className="text-zinc-500 text-sm mb-4">
                  No upcoming appointments scheduled.
                </p>
                <Link href="/booking" className="decoration-none">
                  <Button3D variant="primary" className="mx-auto text-xs py-2 px-4 font-bold">
                    Schedule Your First Session
                  </Button3D>
                </Link>
              </Card3D>
            )}
          </div>

          {/* Right Column: Quick Navigation Grids */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-bold text-zinc-200 border-l-4 border-violet-500 pl-3">
              Quick Shortcuts
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <Link href="/booking" className="col-span-2 group decoration-none">
                <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/60 hover:bg-zinc-900 transition-all duration-300 flex items-center justify-between shadow-lg hover:shadow-rose-500/5 group-hover:border-rose-500/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-rose-600/10 text-rose-400 group-hover:scale-110 transition-transform duration-300">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-200 text-sm">Book Treatment</h4>
                      <p className="text-zinc-500 text-[10px] mt-0.5">Browse services and stylists</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-rose-400 transition-colors" />
                </div>
              </Link>

              <Link href="/profile" className="group decoration-none">
                <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/60 hover:bg-zinc-900 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-violet-500/5 group-hover:border-violet-500/20">
                  <div className="p-2.5 rounded-xl bg-violet-600/10 text-violet-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">My Profile</h4>
                    <p className="text-zinc-500 text-[10px] mt-0.5">Custom preferences</p>
                  </div>
                </div>
              </Link>

              <Link href="/profile/edit" className="group decoration-none">
                <div className="p-5 rounded-2xl border border-white/5 bg-zinc-900/60 hover:bg-zinc-900 transition-all duration-300 h-full flex flex-col justify-between shadow-lg hover:shadow-cyan-500/5 group-hover:border-cyan-500/20">
                  <div className="p-2.5 rounded-xl bg-cyan-600/10 text-cyan-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-200 text-sm">Settings</h4>
                    <p className="text-zinc-500 text-[10px] mt-0.5">Pronouns & theme settings</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
