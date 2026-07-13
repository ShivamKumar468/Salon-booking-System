import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
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
    return NextResponse.json({ stylists });
  } catch (error) {
    console.error('Error fetching stylists:', error);
    return NextResponse.json({ error: 'Failed to fetch stylists' }, { status: 500 });
  }
}
