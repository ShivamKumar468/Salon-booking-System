'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { UserPlus, AlertCircle, Sparkles } from 'lucide-react';
import Input3D from '../ui/Input3D';
import Button3D from '../ui/Button3D';
import AvatarPanel from './AvatarPanel';
import PhotoUpload from './PhotoUpload';
import useNotificationStore from '../../stores/notificationStore';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters long'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(15, 'Password must be at most 15 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  
  // Custom states for profile photo selector
  const [avatarOption, setAvatarOption] = useState<'preset' | 'upload'>('preset');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setFormErrors([]);
    
    // Choose selected photo or avatar
    const avatarUrl = selectedPhoto;

    try {
      const apiRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/auth/register`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            password: data.password,
            phone: data.phone,
            avatarUrl,
          }),
        }
      );

      const apiData = await apiRes.json();

      if (!apiRes.ok) {
        const errorMsgs = apiData.errors || [apiData.error || 'Registration failed'];
        setFormErrors(errorMsgs);
        addToast('Registration failed', 'error');
        setIsLoading(false);
        return;
      }

      addToast('Account created! Logging in...', 'success');
      
      // Auto login
      const loginRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (loginRes?.error) {
        addToast('Redirecting to login...', 'info');
        router.push('/login');
      } else {
        addToast('Welcome to Lumina!', 'success');
        router.push('/dashboard');
      }
    } catch (err) {
      setFormErrors(['Could not connect to authentication server.']);
      addToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {formErrors.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex flex-col gap-1.5 text-rose-200 text-sm animate-shake">
          {formErrors.map((err, index) => (
            <div key={index} className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input3D
            label="First Name"
            type="text"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName')}
          />

          <Input3D
            label="Last Name"
            type="text"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName')}
          />
        </div>

        <Input3D
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input3D
          label="Phone Number (Optional)"
          type="tel"
          placeholder="+1 (555) 123-4567"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <Input3D
          label="Secure Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {/* Avatar Panel / Photo Upload Selector Toggle */}
      <div className="space-y-3">
        <div className="flex bg-zinc-950/60 p-1.5 rounded-xl border border-white/5">
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
            Choose Preset Avatar
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
            Upload Photo
          </button>
        </div>

        {avatarOption === 'preset' ? (
          <AvatarPanel
            selectedAvatar={selectedPhoto}
            onSelectAvatar={(avatarUrl) => setSelectedPhoto(avatarUrl)}
          />
        ) : (
          <PhotoUpload
            selectedPhotoUrl={selectedPhoto}
            onPhotoSelected={(base64) => setSelectedPhoto(base64)}
          />
        )}
      </div>

      <Button3D type="submit" fullWidth disabled={isLoading} variant="primary" className="mt-4">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Creating Profile...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Create Account
          </span>
        )}
      </Button3D>
    </form>
  );
};

export default RegisterForm;
