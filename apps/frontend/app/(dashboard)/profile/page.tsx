'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import useAuth from '../../../components/hooks/useAuth';
import Card3D from '../../../components/ui/Card3D';
import Button3D from '../../../components/ui/Button3D';
import Spinner3D from '../../../components/ui/Spinner3D';
import PageTransition from '../../../components/animations/PageTransition';
import { User, Mail, Shield, Sparkles, Edit2, Calendar } from 'lucide-react';
import useNotificationStore from '../../../stores/notificationStore';

interface ProfileDetails {
  bio: string | null;
  pronouns: string | null;
  preferences: string | null;
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const addToast = useNotificationStore((state) => state.addToast);
  const [profileDetails, setProfileDetails] = useState<ProfileDetails | null>(null);
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
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || '/api'}/user/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setProfileDetails({
            bio: data.user.bio,
            pronouns: data.user.pronouns,
            preferences: data.user.preferences,
          });
        } else {
          addToast('Could not load profile details', 'error');
        }
      } catch (err) {
        console.error('Fetch profile details error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, addToast]);

  if (loading || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner3D />
      </div>
    );
  }

  // Parse preferences
  const preferencesObj = profileDetails?.preferences
    ? JSON.parse(profileDetails.preferences)
    : {};

  return (
    <PageTransition>
      <div className="space-y-6">
        {/* Banner Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
              My Profile
            </h1>
            <p className="text-zinc-400 text-sm">
              Manage your personal preferences, details, and avatar.
            </p>
          </div>
          
          <Link href="/profile/edit" className="decoration-none">
            <Button3D variant="primary">
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button3D>
          </Link>
        </div>

        {/* Profile Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <Card3D glowColor="rgba(255, 51, 102, 0.1)">
              <div className="flex flex-col items-center text-center p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={user.avatarUrl || defaultAvatar}
                  alt={user.name}
                  className="w-28 h-28 rounded-2xl object-cover border border-white/10 shadow-lg mb-4"
                />
                
                <h3 className="text-xl font-bold text-zinc-100">{user.name}</h3>
                {profileDetails?.pronouns && (
                  <span className="text-zinc-500 text-xs font-semibold mt-0.5">
                    ({profileDetails.pronouns})
                  </span>
                )}
                
                <div className="mt-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <Shield className="w-3.5 h-3.5" />
                  {user.role} Member
                </div>

                <div className="w-full border-t border-white/5 my-6" />

                <div className="w-full text-left space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-zinc-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Email Address</p>
                      <p className="text-zinc-300 text-sm truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card3D>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {/* Bio & Details */}
            <Card3D glowColor="rgba(139, 92, 246, 0.05)">
              <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-rose-400" />
                About Me
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed min-h-[60px]">
                {profileDetails?.bio || 'No biography added yet. Update your profile to write a short bio!'}
              </p>
            </Card3D>

            {/* Salon Preferences */}
            <Card3D glowColor="rgba(6, 182, 212, 0.05)">
              <h3 className="text-lg font-bold text-zinc-100 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-violet-400" />
                Salon Preferences
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Hair Type</span>
                  <span className="text-zinc-200 text-sm font-semibold">
                    {preferencesObj.hairType || 'Not specified'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Skin Sensitivity</span>
                  <span className="text-zinc-200 text-sm font-semibold">
                    {preferencesObj.skinType || 'Not specified'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Preferred Music</span>
                  <span className="text-zinc-200 text-sm font-semibold">
                    {preferencesObj.musicType || 'Not specified'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/60 border border-white/5">
                  <span className="text-zinc-500 text-xs font-bold uppercase tracking-wider block mb-1">Chat Preference</span>
                  <span className="text-zinc-200 text-sm font-semibold">
                    {preferencesObj.chatPreference || 'Not specified'}
                  </span>
                </div>
              </div>
            </Card3D>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
