'use client';

import React, { useState, useEffect } from 'react';
import useAuth from '@/components/hooks/useAuth';
import useNotificationStore from '@/stores/notificationStore';
import PageTransition from '@/components/animations/PageTransition';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import Spinner3D from '@/components/ui/Spinner3D';
import { Calendar, Search, Filter, ShieldCheck, User, Sparkles, Check, X, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Booking {
  id: string;
  dateTime: string;
  status: string;
  paymentStatus: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    phone: string | null;
  };
  service: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
  stylist: {
    user: {
      name: string | null;
    };
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { token, user, isLoading: authLoading } = useAuth();
  const addToast = useNotificationStore((state) => state.addToast);

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (!authLoading && (!user || user.role !== 'ADMIN')) {
      addToast('Access denied: Admin only', 'error');
      router.push('/dashboard');
    }
  }, [user, authLoading, router, addToast]);

  const fetchAllBookings = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings);
      } else {
        addToast(data.error || 'Failed to fetch bookings', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('An error occurred while loading bookings', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && user?.role === 'ADMIN') {
      fetchAllBookings();
    }
  }, [token, user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    if (!token) return;
    setUpdatingId(bookingId);
    try {
      const res = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        addToast(`Booking ${newStatus.toLowerCase()} successfully`, 'success');
        // Refresh local bookings list
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
        );
      } else {
        addToast(data.error || 'Failed to update booking status', 'error');
      }
    } catch (err) {
      console.error(err);
      addToast('An error occurred during update', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Compute stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED').length;
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELLED').length;
  const totalRevenue = bookings
    .filter((b) => b.status === 'CONFIRMED')
    .reduce((sum, b) => sum + b.service.price, 0);

  // Filters
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.user.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.user.email.toLowerCase().includes(search.toLowerCase()) ||
      b.service.name.toLowerCase().includes(search.toLowerCase()) ||
      b.stylist.user.name?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (authLoading || (user && user.role !== 'ADMIN')) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner3D />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-zinc-100 flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-rose-500" />
              Administrative Command Center
            </h1>
            <p className="text-zinc-500 text-sm mt-1">
              Monitor sessions, manage time slot occupancy, and update booking status.
            </p>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card3D glowColor="rgba(244, 63, 94, 0.1)" className="p-5 border border-white/5 flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Bookings</span>
            <span className="text-3xl font-black text-zinc-100">{totalBookings}</span>
          </Card3D>
          <Card3D glowColor="rgba(168, 85, 247, 0.1)" className="p-5 border border-white/5 flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Confirmed</span>
            <span className="text-3xl font-black text-violet-400">{confirmedBookings}</span>
          </Card3D>
          <Card3D glowColor="rgba(234, 179, 8, 0.1)" className="p-5 border border-white/5 flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Pending</span>
            <span className="text-3xl font-black text-yellow-500">{pendingBookings}</span>
          </Card3D>
          <Card3D glowColor="rgba(244, 63, 94, 0.1)" className="p-5 border border-white/5 flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Cancelled</span>
            <span className="text-3xl font-black text-rose-400">{cancelledBookings}</span>
          </Card3D>
          <Card3D glowColor="rgba(16, 185, 129, 0.1)" className="p-5 border border-white/5 flex flex-col gap-2">
            <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Total Value (INR)</span>
            <span className="text-2xl font-black text-emerald-400">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </Card3D>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-zinc-950/60 p-4 rounded-2xl border border-white/5">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search user, service, stylist..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 text-zinc-100 placeholder-zinc-500 pl-10 pr-4 py-3 rounded-xl border border-white/5 outline-none focus:border-rose-500/50 text-sm transition-all"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto scrollbar-none">
            {['ALL', 'CONFIRMED', 'PENDING', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  statusFilter === st
                    ? 'bg-rose-600 text-white border-rose-500'
                    : 'bg-zinc-900 text-zinc-400 border-white/5 hover:text-zinc-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Table / List Card */}
        <Card3D glowColor="rgba(255, 255, 255, 0.01)" className="border border-white/5 overflow-hidden">
          {loading ? (
            <div className="py-20 flex justify-center">
              <Spinner3D />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center text-zinc-500 text-sm">
              No matching bookings found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-zinc-900/30">
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Client</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Service</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Stylist</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Date & Time</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400">Status</th>
                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-zinc-400 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredBookings.map((b) => {
                    const isUpdating = updatingId === b.id;
                    const dateObj = new Date(b.dateTime);

                    return (
                      <tr key={b.id} className="hover:bg-white/2 transition-colors">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-sm text-zinc-200">
                              {b.user.name || 'Anonymous User'}
                            </span>
                            <span className="text-xs text-zinc-500">{b.user.email}</span>
                            {b.user.phone && <span className="text-[10px] text-zinc-600">{b.user.phone}</span>}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-medium text-sm text-zinc-200">{b.service.name}</span>
                            <span className="text-xs text-emerald-400 font-semibold">₹{b.service.price}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-zinc-300">
                            {b.stylist.user.name || 'Any Available'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-zinc-300 font-semibold">
                              {dateObj.toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </span>
                            <span className="text-xs text-zinc-500">
                              {dateObj.toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                              b.status === 'CONFIRMED'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : b.status === 'CANCELLED'
                                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-2">
                            {b.status === 'PENDING' && (
                              <>
                                <Button3D
                                  onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                                  disabled={isUpdating}
                                  variant="primary"
                                  className="py-1.5 px-3 text-[10px] font-extrabold bg-emerald-600 hover:bg-emerald-500"
                                >
                                  <Check className="w-3.5 h-3.5 mr-1 inline-block" /> Confirm
                                </Button3D>
                                <Button3D
                                  onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                                  disabled={isUpdating}
                                  variant="accent"
                                  className="py-1.5 px-3 text-[10px] font-extrabold"
                                >
                                  <X className="w-3.5 h-3.5 mr-1 inline-block" /> Reject
                                </Button3D>
                              </>
                            )}

                            {b.status === 'CONFIRMED' && (
                              <Button3D
                                onClick={() => handleUpdateStatus(b.id, 'CANCELLED')}
                                disabled={isUpdating}
                                variant="accent"
                                className="py-1.5 px-3 text-[10px] font-extrabold"
                              >
                                <X className="w-3.5 h-3.5 mr-1 inline-block" /> Cancel Session
                              </Button3D>
                            )}

                            {b.status === 'CANCELLED' && (
                              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider p-2">
                                Terminated
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card3D>
      </div>
    </PageTransition>
  );
}
