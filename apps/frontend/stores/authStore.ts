'use client';

import { create } from 'zustand';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  avatarUrl?: string | null;
  bio?: string | null;
  pronouns?: string | null;
  preferences?: Record<string, any>;
}

interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  updateUser: (profile: Partial<UserProfile>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setToken: (token) => set({ token }),
  updateUser: (profile) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...profile } : null,
    })),
  clearAuth: () => set({ user: null, token: null, isAuthenticated: false }),
}));

export default useAuthStore;
