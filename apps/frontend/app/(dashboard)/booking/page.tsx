'use client';

import React from 'react';
import BookingForm from '../../../components/booking/BookingForm';
import PageTransition from '../../../components/animations/PageTransition';

export default function BookingPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
            Book Appointment
          </h1>
          <p className="text-zinc-400 text-sm">
            Select a service, date, time slot, and stylist to schedule your sanctuary session.
          </p>
        </div>

        <BookingForm />
      </div>
    </PageTransition>
  );
}
