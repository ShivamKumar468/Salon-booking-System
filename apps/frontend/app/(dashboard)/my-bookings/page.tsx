'use client';

import React, { useEffect, useState } from 'react';
import useAuth from '../../../components/hooks/useAuth';
import Card3D from '../../../components/ui/Card3D';
import Button3D from '../../../components/ui/Button3D';
import Spinner3D from '../../../components/ui/Spinner3D';
import PageTransition from '../../../components/animations/PageTransition';
import { Calendar, Clock, DollarSign, User, ShieldAlert, BadgeAlert } from 'lucide-react';
import useNotificationStore from '../../../stores/notificationStore';

interface Booking {
  id: string;
  dateTime: string;
  status: string;
  paymentStatus: string;
  service: {
    id: string;
    name: string;
    description: string;
    price: number;
    duration: number;
    imageUrl?: string;
  };
  stylist: {
    user: {
      name: string;
      avatarUrl?: string;
    };
  };
}

export default function MyBookingsPage() {
  const { token } = useAuth();
  const addToast = useNotificationStore((state) => state.addToast);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch bookings list
  const fetchBookings = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/bookings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings);
      } else {
        addToast('Failed to fetch bookings list', 'error');
      }
    } catch (err) {
      console.error('Fetch bookings list error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancelBooking = async (id: string) => {
    if (!token) return;
    
    const confirmCancel = window.confirm('Are you sure you want to cancel this booking?');
    if (!confirmCancel) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/bookings/cancel/${id}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        addToast('Booking successfully cancelled', 'success');
        // Refresh bookings
        fetchBookings();
      } else {
        addToast('Could not cancel booking', 'error');
      }
    } catch (err) {
      addToast('An error occurred while cancelling', 'error');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner3D />
      </div>
    );
  }

  // Segment upcoming and past bookings
  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => new Date(b.dateTime) >= now && b.status !== 'CANCELLED'
  );
  const pastBookings = bookings.filter(
    (b) => new Date(b.dateTime) < now || b.status === 'CANCELLED'
  );

  return (
    <PageTransition>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
            My Appointments
          </h1>
          <p className="text-zinc-400 text-sm">
            View booking confirmations, session history, and manage active reservations.
          </p>
        </div>

        {/* Upcoming appointments section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-200 border-l-4 border-rose-500 pl-3">
            Active Appointments
          </h2>

          {upcomingBookings.length === 0 ? (
            <Card3D glowColor="rgba(255, 255, 255, 0.01)" className="text-center py-10 text-zinc-500">
              No active appointments. Need a refresh? Go schedule a session!
            </Card3D>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingBookings.map((booking) => {
                const bookingDate = new Date(booking.dateTime);
                return (
                  <Card3D
                    key={booking.id}
                    glowColor="rgba(255, 51, 102, 0.08)"
                    className="border border-white/5 bg-zinc-900/40 p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Booking status badge */}
                      <div className="flex justify-between items-start">
                        <span className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {booking.status}
                        </span>
                        <span className="text-xl font-black text-rose-400">
                          ${booking.service.price.toFixed(2)}
                        </span>
                      </div>

                      {/* Detail list */}
                      <div>
                        <h3 className="text-lg font-bold text-zinc-200">
                          {booking.service.name}
                        </h3>
                        <p className="text-zinc-400 text-xs mt-1 leading-relaxed line-clamp-2">
                          {booking.service.description}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-zinc-500" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Date</p>
                            <p className="text-zinc-300 text-xs font-semibold truncate">
                              {bookingDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-zinc-500" />
                          <div className="min-w-0">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Time Slot</p>
                            <p className="text-zinc-300 text-xs font-semibold truncate">
                              {bookingDate.toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                        <User className="w-4 h-4 text-zinc-500" />
                        <div className="min-w-0">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Stylist</p>
                          <p className="text-zinc-300 text-xs font-semibold truncate">
                            {booking.stylist.user.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4 mt-6 flex justify-end gap-3">
                      <Button3D
                        onClick={() => handleCancelBooking(booking.id)}
                        variant="danger"
                        className="py-2 px-4 text-xs font-bold"
                      >
                        Cancel Appointment
                      </Button3D>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          )}
        </section>

        {/* History appointments section */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-400 border-l-4 border-zinc-700 pl-3">
            Appointment History
          </h2>

          {pastBookings.length === 0 ? (
            <div className="text-zinc-500 text-sm pl-1">
              No past appointments recorded.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastBookings.map((booking) => {
                const bookingDate = new Date(booking.dateTime);
                const isCancelled = booking.status === 'CANCELLED';

                return (
                  <div
                    key={booking.id}
                    className="p-5 rounded-xl border border-white/5 bg-zinc-950/40 opacity-75 hover:opacity-100 transition-opacity flex justify-between items-center gap-4"
                  >
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 ${
                        isCancelled
                          ? 'bg-rose-500/10 border border-rose-500/25 text-rose-400'
                          : 'bg-zinc-800 text-zinc-400 border border-white/5'
                      }`}>
                        {booking.status}
                      </span>

                      <h3 className="font-bold text-zinc-300 text-sm">{booking.service.name}</h3>
                      
                      <div className="flex gap-4 mt-2 text-zinc-500 text-xs">
                        <span>{bookingDate.toLocaleDateString()}</span>
                        <span>&bull;</span>
                        <span>{booking.stylist.user.name}</span>
                      </div>
                    </div>
                    
                    <span className="text-zinc-400 text-sm font-bold">${booking.service.price.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </PageTransition>
  );
}
