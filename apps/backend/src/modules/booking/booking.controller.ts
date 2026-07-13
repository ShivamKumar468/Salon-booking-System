import { Router, Response } from 'express';
import { z } from 'zod';
import prisma from '../../lib/prisma';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth';

const router = Router();

const bookingCreateSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID'),
  stylistId: z.string().uuid('Invalid stylist ID'),
  dateTime: z.string().datetime('Invalid ISO date time string'),
});

// Seed data function to populate services and stylists if they don't exist
async function ensureSeedData() {
  const serviceCount = await prisma.service.count();
  if (serviceCount === 0) {
    console.log('Seeding initial services...');
    await prisma.service.createMany({
      data: [
        {
          name: 'Signature Haircut & Style',
          description: 'A customized haircut, wash, blowout, and style tailored to your face shape and hair texture.',
          duration: 45,
          price: 65.0,
          category: 'Hair',
          imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Balayage & Glow Treatment',
          description: 'Hand-painted highlights for a natural, sun-kissed look, complete with a nourishing gloss treatment.',
          duration: 150,
          price: 180.0,
          category: 'Hair',
          imageUrl: 'https://images.unsplash.com/photo-1620331702289-53b3ebbdf19c?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'HydraFacial Deluxe',
          description: 'Deep cleansing, chemical exfoliation, painless extractions, and intense hydration with nourishing peptides.',
          duration: 60,
          price: 120.0,
          category: 'Skin',
          imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Gel Manicure & Hand Massage',
          description: 'Nail shaping, cuticle care, premium gel polish application cured under LED light, and hot oil massage.',
          duration: 45,
          price: 45.0,
          category: 'Nails',
          imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=500&auto=format&fit=crop&q=60',
        },
        {
          name: 'Deep Tissue Therapeutic Massage',
          description: 'Targeted firm pressure to release chronic muscle tension, improve blood flow, and alleviate stiffness.',
          duration: 75,
          price: 95.0,
          category: 'Massage',
          imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&auto=format&fit=crop&q=60',
        },
      ],
    });
  }

  const stylistCount = await prisma.stylist.count();
  if (stylistCount === 0) {
    console.log('Seeding initial stylists...');
    // We need to create corresponding users for these stylists first
    const stylistUsers = [
      {
        email: 'alex.hair@salon.com',
        name: 'Alex Rivera',
        bio: 'Master stylist with 8+ years experience specializing in modern cuts and vibrant hair coloring.',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=60',
        specialities: 'Hair, Coloring, Styling',
        availability: JSON.stringify({
          workDays: [1, 2, 3, 4, 5], // Mon to Fri
          workHours: { start: '09:00', end: '17:00' },
        }),
      },
      {
        email: 'sarah.skin@salon.com',
        name: 'Sarah Chen',
        bio: 'Licensed esthetician passionate about skin health, customized facials, and anti-aging treatments.',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=60',
        specialities: 'Skin, Facials, Chemical Peels',
        availability: JSON.stringify({
          workDays: [2, 3, 4, 5, 6], // Tue to Sat
          workHours: { start: '10:00', end: '18:00' },
        }),
      },
      {
        email: 'marcus.nails@salon.com',
        name: 'Marcus Brody',
        bio: 'Creative nail artist focusing on modern nail art, manicures, and relaxing hand therapies.',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=60',
        specialities: 'Nails, Manicures, Nail Art',
        availability: JSON.stringify({
          workDays: [1, 3, 4, 5, 6], // Mon, Wed, Thu, Fri, Sat
          workHours: { start: '09:30', end: '17:30' },
        }),
      },
    ];

    for (const su of stylistUsers) {
      // Create user
      const user = await prisma.user.create({
        data: {
          email: su.email,
          name: su.name,
          passwordHash: '$2b$10$wE9V8B/f9QeT8XjB.6j8aOEqYvGqQxG8/l03iT8QpB0h8a9v6F/yW', // dummy hash for alex123!
          role: 'STYLIST',
          avatarUrl: su.avatarUrl,
          bio: su.bio,
        },
      });

      // Create stylist details
      await prisma.stylist.create({
        data: {
          userId: user.id,
          bio: su.bio,
          specialities: su.specialities,
          availability: su.availability,
          rating: 4.8 + Math.random() * 0.2, // 4.8 to 5.0
          isAvailable: true,
        },
      });
    }
  }
}

// Get service catalog
router.get('/services', async (req, res): Promise<void> => {
  try {
    await ensureSeedData();
    const { category, search, minPrice, maxPrice } = req.query;

    const whereClause: any = {};

    if (category && category !== 'All') {
      whereClause.category = category as string;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price.gte = parseFloat(minPrice as string);
      if (maxPrice) whereClause.price.lte = parseFloat(maxPrice as string);
    }

    const services = await prisma.service.findMany({
      where: whereClause,
      orderBy: { name: 'asc' },
    });

    res.status(200).json({ services });
  } catch (error) {
    console.error('Fetch services error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get stylist profiles
router.get('/stylists', async (req, res): Promise<void> => {
  try {
    await ensureSeedData();
    const stylists = await prisma.stylist.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
      where: {
        isAvailable: true,
      },
    });

    res.status(200).json({ stylists });
  } catch (error) {
    console.error('Fetch stylists error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking
router.post('/create', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const parseResult = bookingCreateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({ error: parseResult.error.errors[0].message });
      return;
    }

    const { serviceId, stylistId, dateTime } = parseResult.data;
    const bookingDate = new Date(dateTime);

    // Verify service exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }

    // Verify stylist exists
    const stylist = await prisma.stylist.findUnique({
      where: { id: stylistId },
      include: { user: true },
    });
    if (!stylist) {
      res.status(404).json({ error: 'Stylist not found' });
      return;
    }

    // Check stylist availability schedule
    const availability = stylist.availability ? JSON.parse(stylist.availability) : null;
    if (availability) {
      const dayOfWeek = bookingDate.getUTCDay(); // 0 is Sunday, 1 is Monday, etc.
      if (!availability.workDays.includes(dayOfWeek)) {
        res.status(400).json({ error: 'Stylist does not work on this day of the week' });
        return;
      }
    }

    // Check double bookings for the stylist at that exact time slot
    // Define slot overlap: booking begins at bookingDate, lasts for service.duration minutes.
    const startTime = bookingDate;
    const endTime = new Date(bookingDate.getTime() + service.duration * 60000);

    const conflictingBooking = await prisma.booking.findFirst({
      where: {
        stylistId,
        status: { notIn: ['CANCELLED'] },
        dateTime: {
          gte: new Date(startTime.getTime() - 30 * 60000), // Check within 30 min window
          lte: endTime,
        },
      },
    });

    if (conflictingBooking) {
      res.status(409).json({ error: 'Stylist is already booked around this time slot' });
      return;
    }

    // Create unique mock QR code
    const qrCodeMock = `SALON-QR-${userId.substring(0, 4)}-${serviceId.substring(0, 4)}-${Date.now()}`;

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId,
        stylistId,
        dateTime: bookingDate,
        status: 'CONFIRMED', // Auto confirm for MVP
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
        userId,
        title: 'Booking Confirmed!',
        message: `Your booking for ${service.name} with ${booking.stylist.user.name} on ${bookingDate.toLocaleDateString()} has been scheduled.`,
      },
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking,
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch user's bookings
router.get('/my-bookings', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
            duration: true,
            imageUrl: true,
          },
        },
        stylist: {
          include: {
            user: {
              select: {
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        dateTime: 'desc',
      },
    });

    res.status(200).json({ bookings });
  } catch (error) {
    console.error('Fetch bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.post('/cancel/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const bookingId = req.params.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { service: true },
    });

    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }

    if (booking.userId !== userId) {
      res.status(403).json({ error: 'Forbidden: You do not own this booking' });
      return;
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        title: 'Booking Cancelled',
        message: `Your booking for ${booking.service.name} has been successfully cancelled.`,
      },
    });

    res.status(200).json({
      message: 'Booking cancelled successfully',
      booking: updatedBooking,
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
