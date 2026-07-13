'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useAuth from '@/components/hooks/useAuth';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import Input3D from '@/components/ui/Input3D';
import Spinner3D from '@/components/ui/Spinner3D';
import PageTransition from '@/components/animations/PageTransition';
import AvatarPanel from '@/components/auth/AvatarPanel';
import PhotoUpload from '@/components/auth/PhotoUpload';
import { ArrowLeft, Save, AlertCircle, Sparkles } from 'lucide-react';
import useNotificationStore from '@/stores/notificationStore';
import useAuthStore from '@/stores/authStore';

const profileEditSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long'),
  bio: z.string().max(300, 'Bio must be under 300 characters').optional().nullable(),
  pronouns: z.string().max(20, 'Pronouns must be under 20 characters').optional().nullable(),
  hairType: z.string().optional(),
  skinType: z.string().optional(),
  musicType: z.string().optional(),
  chatPreference: z.string().optional(),
});

type ProfileEditFormValues = z.infer<typeof profileEditSchema>;

export default function ProfileEditPage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const updateUserStore = useAuthStore((state) => state.updateUser);
  const addToast = useNotificationStore((state) => state.addToast);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Custom avatar/photo states
  const [avatarOption, setAvatarOption] = useState<'preset' | 'upload'>('preset');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileEditFormValues>({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      name: '',
      bio: '',
      pronouns: '',
      hairType: 'Straight',
      skinType: 'Normal',
      musicType: 'Chill Lofi',
      chatPreference: 'Minimalist Chat',
    },
  });

  // Fetch current details
  useEffect(() => {
    if (!token || !user) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || '/api'}/user/profile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (res.ok) {
          setValue('name', data.user.name || '');
          setValue('bio', data.user.bio || '');
          setValue('pronouns', data.user.pronouns || '');
          
          if (data.user.avatarUrl) {
            setSelectedPhoto(data.user.avatarUrl);
            if (!data.user.avatarUrl.startsWith('data:image/svg+xml')) {
              setAvatarOption('upload');
            }
          }

          if (data.user.preferences) {
            const prefs = JSON.parse(data.user.preferences);
            if (prefs.hairType) setValue('hairType', prefs.hairType);
            if (prefs.skinType) setValue('skinType', prefs.skinType);
            if (prefs.musicType) setValue('musicType', prefs.musicType);
            if (prefs.chatPreference) setValue('chatPreference', prefs.chatPreference);
          }
        }
      } catch (err) {
        console.error('Fetch profile details error:', err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchProfile();
  }, [token, user, setValue]);

  const onSubmit = async (data: ProfileEditFormValues) => {
    if (!token) return;
    setIsSaving(true);
    setFormErrors([]);

    try {
      // 1. Save general profile
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/user/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: data.name,
            bio: data.bio,
            pronouns: data.pronouns,
            avatarUrl: selectedPhoto,
          }),
        }
      );

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        setFormErrors(profileData.errors || ['Failed to update profile']);
        addToast('Profile update failed', 'error');
        setIsSaving(false);
        return;
      }

      // 2. Save preferences
      const prefsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/user/preferences`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            preferences: {
              hairType: data.hairType,
              skinType: data.skinType,
              musicType: data.musicType,
              chatPreference: data.chatPreference,
            },
          }),
        }
      );

      if (!prefsRes.ok) {
        addToast('Preferences update failed, but profile updated.', 'warning');
      } else {
        addToast('Profile and preferences updated!', 'success');
      }

      // Sync local authStore
      updateUserStore({
        name: data.name,
        avatarUrl: selectedPhoto,
      });

      router.push('/profile');
      router.refresh();
    } catch (err) {
      setFormErrors(['An unexpected error occurred.']);
      addToast('An error occurred', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingDetails || !user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <Spinner3D />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
              Edit Profile
            </h1>
            <p className="text-zinc-400 text-sm">Update your public details and customization details.</p>
          </div>
        </div>

        {formErrors.length > 0 && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex flex-col gap-1.5 text-rose-200 text-sm animate-shake">
            {formErrors.map((err, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>{err}</span>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Avatar Settings Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card3D glowColor="rgba(255, 51, 102, 0.08)">
              <h3 className="text-md font-bold text-zinc-100 mb-4">Choose Avatar</h3>
              
              <div className="flex bg-zinc-950/60 p-1.5 rounded-xl border border-white/5 mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setAvatarOption('preset');
                    setSelectedPhoto(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    avatarOption === 'preset'
                      ? 'bg-zinc-800 text-zinc-100 shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAvatarOption('upload');
                    setSelectedPhoto(null);
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    avatarOption === 'upload'
                      ? 'bg-zinc-800 text-zinc-100 shadow-md'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Upload File
                </button>
              </div>

              {avatarOption === 'preset' ? (
                <AvatarPanel
                  selectedAvatar={selectedPhoto}
                  onSelectAvatar={(url) => setSelectedPhoto(url)}
                />
              ) : (
                <PhotoUpload
                  selectedPhotoUrl={selectedPhoto}
                  onPhotoSelected={(base64) => setSelectedPhoto(base64)}
                />
              )}
            </Card3D>
          </div>

          {/* Form Settings Columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card3D glowColor="rgba(139, 92, 246, 0.04)">
              <h3 className="text-md font-bold text-zinc-100 mb-4">Basic Details</h3>
              <div className="space-y-4">
                <Input3D
                  label="Display Name"
                  type="text"
                  error={errors.name?.message}
                  {...register('name')}
                />
                
                <Input3D
                  label="Pronouns"
                  type="text"
                  placeholder="e.g. they/them, she/her"
                  error={errors.pronouns?.message}
                  {...register('pronouns')}
                />

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-sm font-medium tracking-wide pl-1">
                    Short Biography
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Tell us a little bit about yourself, hair concerns, style goals..."
                    className="w-full bg-zinc-900/80 text-zinc-100 placeholder-zinc-600 px-4 py-3 rounded-xl border border-white/5 focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/25 outline-none transition-all resize-none text-sm"
                    {...register('bio')}
                  />
                  {errors.bio && (
                    <span className="text-red-400 text-xs pl-1 font-medium mt-0.5">{errors.bio.message}</span>
                  )}
                </div>
              </div>
            </Card3D>

            <Card3D glowColor="rgba(6, 182, 212, 0.04)">
              <h3 className="text-md font-bold text-zinc-100 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                Customize Sanctuary Settings
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-sm font-medium pl-1">Hair Type</label>
                  <select
                    className="w-full bg-zinc-900 text-zinc-100 px-4 py-3 rounded-xl border border-white/5 outline-none focus:border-rose-500/50 cursor-pointer text-sm"
                    {...register('hairType')}
                  >
                    <option>Straight</option>
                    <option>Wavy</option>
                    <option>Curly</option>
                    <option>Coily</option>
                    <option>Thin / Fine</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-sm font-medium pl-1">Skin Type</label>
                  <select
                    className="w-full bg-zinc-900 text-zinc-100 px-4 py-3 rounded-xl border border-white/5 outline-none focus:border-rose-500/50 cursor-pointer text-sm"
                    {...register('skinType')}
                  >
                    <option>Normal</option>
                    <option>Dry</option>
                    <option>Oily</option>
                    <option>Combination</option>
                    <option>Sensitive</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-sm font-medium pl-1">In-Chair Music</label>
                  <select
                    className="w-full bg-zinc-900 text-zinc-100 px-4 py-3 rounded-xl border border-white/5 outline-none focus:border-rose-500/50 cursor-pointer text-sm"
                    {...register('musicType')}
                  >
                    <option>Chill Lofi</option>
                    <option>Ambient Electronic</option>
                    <option>Classical Sanctuary</option>
                    <option>Upbeat Pop</option>
                    <option>Silent Retreat</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-sm font-medium pl-1">Chat Preference</label>
                  <select
                    className="w-full bg-zinc-900 text-zinc-100 px-4 py-3 rounded-xl border border-white/5 outline-none focus:border-rose-500/50 cursor-pointer text-sm"
                    {...register('chatPreference')}
                  >
                    <option>Minimalist Chat</option>
                    <option>Friendly & Outgoing</option>
                    <option>Silent Treatment (Quiet Comfort)</option>
                    <option>AI-Match (Let Stylist Guide)</option>
                  </select>
                </div>
              </div>
            </Card3D>

            <Button3D type="submit" fullWidth disabled={isSaving} variant="primary">
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Saving Profile...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  Save Changes
                </span>
              )}
            </Button3D>
          </div>
        </form>
      </div>
    </PageTransition>
  );
}
