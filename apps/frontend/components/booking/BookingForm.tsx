'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useBookingStore from '../../stores/bookingStore';
import useAuth from '../hooks/useAuth';
import useNotificationStore from '../../stores/notificationStore';
import ServiceSelector from './ServiceSelector';
import Calendar3D from './Calendar3D';
import StylistSelector3D from './StylistSelector3D';
import Button3D from '../ui/Button3D';
import Card3D from '../ui/Card3D';
import { ChevronLeft, ChevronRight, Check, Sparkles, AlertCircle, ShoppingBag } from 'lucide-react';

export const BookingForm: React.FC = () => {
  const router = useRouter();
  const { token } = useAuth();
  const addToast = useNotificationStore((state) => state.addToast);
  
  const {
    step,
    selectedService,
    selectedDate,
    selectedTimeSlot,
    selectedStylist,
    nextStep,
    prevStep,
    resetBooking,
    setStep,
  } = useBookingStore();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTimeSlot || !selectedStylist || !token) {
      addToast('Missing booking selections', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Combine date and time slot
    // selectedTimeSlot: e.g. "10:30 AM" or "01:30 PM"
    const [time, modifier] = selectedTimeSlot.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    const bookingDateTime = new Date(selectedDate);
    bookingDateTime.setHours(hours, minutes, 0, 0);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || '/api'}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            serviceId: selectedService.id,
            stylistId: selectedStylist.id,
            dateTime: bookingDateTime.toISOString(),
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        addToast('Booking successfully scheduled!', 'success');
        resetBooking();
        router.push(`/booking/success?id=${data.booking.id}&qrCode=${data.booking.qrCode || ''}`);
      } else {
        setErrorMessage(data.error || 'Failed to complete booking');
        addToast('Booking conflict detected', 'error');
      }
    } catch (err) {
      setErrorMessage('Could not connect to booking server.');
      addToast('An error occurred', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'Select a Service';
      case 2:
        return 'Choose Date & Time';
      case 3:
        return 'Choose Your Stylist';
      case 4:
      default:
        return 'Confirm Reservation';
    }
  };

  const isNextDisabled = () => {
    if (step === 1) return !selectedService;
    if (step === 2) return !selectedDate || !selectedTimeSlot;
    if (step === 3) return !selectedStylist;
    return false;
  };

  return (
    <div className="space-y-6">
      {/* Steps Indicator Progress bar */}
      <div className="flex justify-between items-center max-w-xl mx-auto mb-8 bg-zinc-950/60 p-4 rounded-2xl border border-white/5 relative">
        <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-800 -z-10" />
        <div
          className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-rose-500 transition-all duration-300 -z-10"
          style={{ width: `${((step - 1) / 3) * 100}%` }}
        />

        {[1, 2, 3, 4].map((s) => {
          const isCompleted = step > s;
          const isActive = step === s;

          return (
            <button
              key={s}
              disabled={s > step && isNextDisabled()}
              onClick={() => setStep(s)}
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-500/10'
                  : isActive
                  ? 'bg-zinc-900 text-rose-400 border-rose-500/40 shadow-inner'
                  : 'bg-zinc-950 text-zinc-600 border-white/5'
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : s}
            </button>
          );
        })}
      </div>

      {/* Step Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-extrabold text-zinc-100">{getStepTitle()}</h2>
        <p className="text-zinc-500 text-xs mt-1 uppercase tracking-widest">
          Step {step} of 4
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 flex items-center gap-3 text-rose-200 text-sm max-w-2xl mx-auto">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step content wrapper */}
      <div className="min-h-[40vh] py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && <ServiceSelector />}
            {step === 2 && <Calendar3D />}
            {step === 3 && <StylistSelector3D />}
            {step === 4 && (
              <div className="max-w-2xl mx-auto">
                <Card3D glowColor="rgba(255, 51, 102, 0.15)" className="border border-white/5 p-8">
                  <h3 className="text-lg font-bold text-zinc-100 border-b border-white/5 pb-4 mb-6 flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-rose-500" />
                    Reservation Summary
                  </h3>

                  <div className="space-y-6">
                    {/* Service detail */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="text-sm text-zinc-400 uppercase font-bold tracking-wider">Service</h4>
                        <p className="text-zinc-100 font-bold text-lg mt-1">
                          {selectedService?.name}
                        </p>
                        <span className="text-zinc-500 text-xs mt-0.5 block">
                          Duration: {selectedService?.duration} minutes
                        </span>
                      </div>
                      <span className="text-xl font-black text-rose-400">
                        ${selectedService?.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Schedule detail */}
                    <div className="border-t border-white/5 pt-4">
                      <h4 className="text-sm text-zinc-400 uppercase font-bold tracking-wider">Schedule</h4>
                      <p className="text-zinc-100 font-bold mt-1">
                        {selectedDate?.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="text-violet-400 text-sm font-semibold mt-0.5">
                        Selected Time: {selectedTimeSlot}
                      </p>
                    </div>

                    {/* Stylist detail */}
                    <div className="border-t border-white/5 pt-4">
                      <h4 className="text-sm text-zinc-400 uppercase font-bold tracking-wider">Stylist</h4>
                      <p className="text-zinc-100 font-bold mt-1">
                        {selectedStylist?.user.name}
                      </p>
                      <p className="text-zinc-500 text-xs mt-0.5">
                        Rating: {selectedStylist?.rating.toFixed(1)} ★
                      </p>
                    </div>
                  </div>
                </Card3D>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center max-w-xl mx-auto pt-6 border-t border-white/5">
        <Button3D
          type="button"
          onClick={prevStep}
          disabled={step === 1 || isSubmitting}
          variant="secondary"
          className={step === 1 ? 'opacity-0 pointer-events-none' : ''}
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back
        </Button3D>

        {step < 4 ? (
          <Button3D
            type="button"
            onClick={nextStep}
            disabled={isNextDisabled()}
            variant="primary"
          >
            Next Step
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button3D>
        ) : (
          <Button3D
            type="button"
            onClick={handleConfirmBooking}
            disabled={isSubmitting}
            variant="primary"
            className="hover:shadow-[0_0_20px_rgba(255,51,102,0.35)]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Scheduling...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Confirm Appointment
              </span>
            )}
          </Button3D>
        )}
      </div>
    </div>
  );
};

export default BookingForm;
