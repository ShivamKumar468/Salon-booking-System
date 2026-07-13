'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LogIn, KeyRound, Mail, AlertCircle } from 'lucide-react';
import Input3D from '../ui/Input3D';
import Button3D from '../ui/Button3D';
import useNotificationStore from '../../stores/notificationStore';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const addToast = useNotificationStore((state) => state.addToast);
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setFormError(null);
    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setFormError('Invalid email or password. Please try again.');
        addToast('Login failed', 'error');
      } else {
        addToast('Welcome back to Lumina!', 'success');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
      addToast('An error occurred during sign in', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {formError && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-rose-200 text-sm animate-shake">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
          <span>{formError}</span>
        </div>
      )}

      <div className="space-y-4">
        <Input3D
          label="Email Address"
          type="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input3D
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold pl-1">
        <label className="flex items-center gap-2 text-zinc-400 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-white/10 bg-zinc-900 text-rose-500 focus:ring-rose-500/50 w-4 h-4 cursor-pointer"
          />
          Remember me
        </label>
        <a href="/forgot-password" className="text-rose-400 hover:text-rose-300 transition-colors">
          Forgot Password?
        </a>
      </div>

      <Button3D type="submit" fullWidth disabled={isLoading} variant="primary" className="mt-2">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Authenticating...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Login to Account
          </span>
        )}
      </Button3D>
    </form>
  );
};

export default LoginForm;
