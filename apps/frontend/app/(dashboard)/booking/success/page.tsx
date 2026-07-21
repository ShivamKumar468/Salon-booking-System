'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Card3D from '@/components/ui/Card3D';
import Button3D from '@/components/ui/Button3D';
import PageTransition from '@/components/animations/PageTransition';
import { CheckCircle, Calendar, ArrowRight } from 'lucide-react';

function BookingSuccessContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('id') || 'UNKNOWN';
  const qrCodeData = searchParams.get('qrCode') || 'SALON-QR-CODE';

  return (
    <PageTransition>
      <div className="max-w-md mx-auto py-12 text-center space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500/20 rounded-full filter blur-xl animate-pulse" />
            <CheckCircle className="w-16 h-16 text-emerald-400 relative z-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100">
            Booking Confirmed!
          </h1>
          <p className="text-zinc-400 text-sm">
            Your appointment has been successfully scheduled.
          </p>
        </div>

        {/* QR Code Container */}
        <Card3D glowColor="rgba(16, 185, 129, 0.1)" className="p-8 border border-white/5 bg-zinc-900/40 relative">
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-zinc-300 text-xs font-bold tracking-widest uppercase">
              Sanctuary Check-in Key
            </h3>

            {/* Mock QR Code representation */}
            <div className="relative bg-white p-4 rounded-2xl shadow-lg w-48 h-48 flex items-center justify-center border-4 border-emerald-500/20">
              {/* Dynamic Scanning Laser Animation */}
              <div className="absolute left-0 right-0 h-0.5 bg-emerald-500/50 shadow-[0_0_8px_#10b981] top-0 animate-[bounce_3s_infinite_linear]" />
              
              {/* Visual geometric blocks simulating QR code */}
              <div className="w-full h-full grid grid-cols-5 gap-1.5 opacity-90">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const isCorner = 
                    idx === 0 || idx === 1 || idx === 5 || idx === 6 || // Top-Left corner
                    idx === 3 || idx === 4 || idx === 8 || idx === 9 || // Top-Right corner
                    idx === 20 || idx === 21 || idx === 15 || idx === 16; // Bottom-Left corner
                  
                  const isRandomSolid = !isCorner && Math.random() > 0.45;

                  return (
                    <div
                      key={idx}
                      className={`rounded-xs transition-colors duration-1000 ${
                        isCorner 
                          ? 'bg-zinc-900 border-2 border-zinc-900' 
                          : isRandomSolid 
                          ? 'bg-zinc-900' 
                          : 'bg-zinc-100'
                      }`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="text-center">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">
                Booking Reference
              </span>
              <code className="text-zinc-300 text-xs bg-zinc-950 px-3 py-1.5 rounded-lg border border-white/5">
                {bookingId.substring(0, 8).toUpperCase()}-{qrCodeData.split('-').pop()}
              </code>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed max-w-[280px]">
              Present this check-in key at the front desk when you arrive for scan confirmation.
            </p>
          </div>
        </Card3D>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/my-bookings" className="decoration-none">
            <Button3D variant="secondary" className="w-full">
              <Calendar className="w-4 h-4 mr-2" />
              View Bookings
            </Button3D>
          </Link>
          <Link href="/dashboard" className="decoration-none">
            <Button3D variant="primary" className="w-full">
              Go to Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button3D>
          </Link>
        </div>
      </div>
    </PageTransition>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="max-w-md mx-auto py-12 text-center">
        <div className="animate-pulse text-zinc-400">Loading...</div>
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
