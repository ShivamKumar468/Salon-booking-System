'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import useAuthStore from '../../stores/authStore';

export const useAuth = () => {
  const { data: session, status } = useSession();
  const { setUser, setToken, clearAuth, user, token } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const sUser = session.user as any;
      setUser({
        id: sUser.id,
        email: sUser.email,
        name: sUser.name,
        role: sUser.role,
        avatarUrl: sUser.avatarUrl,
      });
      setToken(sUser.accessToken || null);
    } else if (status === 'unauthenticated') {
      clearAuth();
    }
  }, [session, status, setUser, setToken, clearAuth]);

  return {
    user,
    token,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login: signIn,
    logout: () => signOut({ callbackUrl: '/login' }),
  };
};

export default useAuth;
