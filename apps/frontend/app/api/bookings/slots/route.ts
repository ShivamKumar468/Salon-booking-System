import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get('date'); // e.g. "2026-07-12"
    if (!dateStr) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    const targetDate = new Date(dateStr);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        dateTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: 'CANCELLED' },
      },
    });

    // Define standard slots
    const slots = [
      { label: '09:00 AM', hours: 9, minutes: 0 },
      { label: '10:30 AM', hours: 10, minutes: 30 },
      { label: '12:00 PM', hours: 12, minutes: 0 },
      { label: '01:30 PM', hours: 13, minutes: 30 },
      { label: '03:00 PM', hours: 15, minutes: 0 },
      { label: '04:30 PM', hours: 16, minutes: 30 },
    ];

    const slotAvailability = slots.map((slot) => {
      const count = bookings.filter((b) => {
        const bDate = new Date(b.dateTime);
        return bDate.getHours() === slot.hours && bDate.getMinutes() === slot.minutes;
      }).length;

      return {
        slot: slot.label,
        bookingsCount: count,
        available: count < 2, // max 2 bookings per slot
      };
    });

    return NextResponse.json({ slots: slotAvailability });
  } catch (error) {
    console.error('Error fetching slots:', error);
    return NextResponse.json({ error: 'Failed to fetch slots' }, { status: 500 });
  }
}
