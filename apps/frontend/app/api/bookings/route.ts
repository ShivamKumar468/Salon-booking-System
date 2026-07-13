import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: user.id },
      include: {
        service: true,
        stylist: { include: { user: true } },
      },
      orderBy: { dateTime: 'desc' },
    });

    // Return the response shape the frontend expects (data.bookings)
    return NextResponse.json({ bookings });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { serviceId, stylistId, dateTime } = await request.json();

    if (!serviceId || !stylistId || !dateTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Verify service and stylist exist
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    const stylist = await prisma.stylist.findUnique({ where: { id: stylistId } });

    if (!service || !stylist) {
      return NextResponse.json({ error: 'Service or stylist not found' }, { status: 404 });
    }

    // Check if the selected slot is already fully booked (max 2 bookings)
    const bookingDate = new Date(dateTime);
    const startOfSlot = new Date(bookingDate);
    startOfSlot.setSeconds(0, 0);
    const endOfSlot = new Date(bookingDate);
    endOfSlot.setSeconds(59, 999);

    const existingBookingsCount = await prisma.booking.count({
      where: {
        dateTime: {
          gte: startOfSlot,
          lte: endOfSlot,
        },
        status: { not: 'CANCELLED' },
      },
    });

    if (existingBookingsCount >= 2) {
      return NextResponse.json(
        { error: 'This time slot is fully booked. Please select another slot.' },
        { status: 400 }
      );
    }

    // Create unique mock QR code
    const qrCodeMock = `SALON-QR-${user.id.substring(0, 4)}-${serviceId.substring(0, 4)}-${Date.now()}`;

    const booking = await prisma.booking.create({
      data: {
        userId: user.id,
        serviceId,
        stylistId,
        dateTime: bookingDate,
        status: 'CONFIRMED', // Set to CONFIRMED for instant booking flow
        paymentStatus: 'PENDING',
        qrCode: qrCodeMock,
      },
      include: {
        service: true,
        stylist: {
          include: {
            user: {
              select: { name: true },
            },
          },
        },
      },
    });

    // Create user notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: 'Booking Confirmed!',
        message: `Your booking for ${service.name} has been scheduled.`,
      },
    });

    // Return the response shape the frontend expects (data.booking)
    return NextResponse.json({
      message: 'Booking created successfully',
      booking,
    }, { status: 201 });
  } catch (error) {
    console.error('Failed to create booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}
