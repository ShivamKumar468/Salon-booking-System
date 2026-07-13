'use client';

import { create } from 'zustand';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  category: string;
}

export interface Stylist {
  id: string;
  userId: string;
  bio?: string;
  specialities?: string;
  rating: number;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

interface BookingState {
  step: number;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTimeSlot: string | null;
  selectedStylist: Stylist | null;
  
  setService: (service: Service) => void;
  setDate: (date: Date) => void;
  setTimeSlot: (slot: string | null) => void;
  setStylist: (stylist: Stylist) => void;
  nextStep: () => void;
  prevStep: () => void;
  setStep: (step: number) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  step: 1,
  selectedService: null,
  selectedDate: null,
  selectedTimeSlot: null,
  selectedStylist: null,

  setService: (service) => set({ selectedService: service, step: 2 }),
  setDate: (date) => set({ selectedDate: date }),
  setTimeSlot: (slot) => set({ selectedTimeSlot: slot }),
  setStylist: (stylist) => set({ selectedStylist: stylist }),
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 4) })),
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  setStep: (step) => set({ step }),
  resetBooking: () =>
    set({
      step: 1,
      selectedService: null,
      selectedDate: null,
      selectedTimeSlot: null,
      selectedStylist: null,
    }),
}));

export default useBookingStore;
