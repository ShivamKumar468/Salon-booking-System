'use client';

import React, { useEffect, useState } from 'react';
import useAuth from '../hooks/useAuth';
import Card3D from '../ui/Card3D';
import Button3D from '../ui/Button3D';
import Spinner3D from '../ui/Spinner3D';
import { Star, Award, ShieldCheck } from 'lucide-react';
import useNotificationStore from '../../stores/notificationStore';
import useBookingStore, { Stylist } from '../../stores/bookingStore';

export const StylistSelector3D: React.FC = () => {
  const { token } = useAuth();
  const setStylist = useBookingStore((state) => state.setStylist);
  const selectedStylist = useBookingStore((state) => state.selectedStylist);
  const addToast = useNotificationStore((state) => state.addToast);
  
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  // Fallback default avatar
  const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <rect width="100" height="100" rx="24" fill="#27272a"/>
      <circle cx="50" cy="40" r="14" fill="#a1a1aa"/>
      <path d="M25,80 Q50,55 75,80" fill="#a1a1aa"/>
    </svg>
  `)}`;

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || '/api'}/stylists`
        );
        const data = await res.json();
        if (res.ok) {
          setStylists(data.stylists);
        } else {
          addToast('Could not fetch stylists', 'error');
        }
      } catch (err) {
        console.error('Fetch stylists error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, [addToast]);

  if (loading) {
    return (
      <div className="min-h-[25vh] flex items-center justify-center">
        <Spinner3D />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stylists.map((stylist) => {
        const isSelected = selectedStylist?.id === stylist.id;
        const specialtyTags = stylist.specialities
          ? stylist.specialities.split(',').map((s) => s.trim())
          : [];

        return (
          <Card3D
            key={stylist.id}
            glowColor={isSelected ? 'rgba(139, 92, 246, 0.25)' : 'rgba(255, 255, 255, 0.03)'}
            className={`flex flex-col h-full border ${
              isSelected ? 'border-violet-500/40 bg-zinc-900/60' : 'border-white/5'
            }`}
          >
            <div className="flex flex-col items-center text-center flex-grow">
              {/* Stylist Profile Pic */}
              <div className="relative mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={stylist.user.avatarUrl || defaultAvatar}
                  alt={stylist.user.name}
                  className="w-24 h-24 rounded-2xl object-cover border border-white/10 shadow-md"
                />
                
                {/* Availability bubble */}
                <span className="absolute bottom-1 right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-zinc-900"></span>
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-2.5 py-0.5 mb-2.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-zinc-200 text-xs font-bold">{stylist.rating.toFixed(1)}</span>
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-zinc-100 mb-1 flex items-center gap-1 justify-center">
                {stylist.user.name}
                <ShieldCheck className="w-4.5 h-4.5 text-violet-400" />
              </h3>

              {/* Bio */}
              <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 mb-4">
                {stylist.bio}
              </p>

              {/* Specialty Tags */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-6">
                {specialtyTags.map((spec) => (
                  <span
                    key={spec}
                    className="bg-zinc-950/60 border border-white/5 text-zinc-400 px-2 py-0.5 rounded-lg text-[10px] font-bold"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Select Button */}
            <div className="mt-auto pt-4 border-t border-white/5">
              <Button3D
                onClick={() => setStylist(stylist)}
                variant={isSelected ? 'accent' : 'secondary'}
                fullWidth
                className="py-2.5 text-xs font-bold"
              >
                {isSelected ? 'Selected' : 'Select Stylist'}
              </Button3D>
            </div>
          </Card3D>
        );
      })}
    </div>
  );
};

export default StylistSelector3D;
