import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clear existing database to avoid duplicate records on re-seed
  await prisma.booking.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.user.deleteMany();

  // Create Indian salon services
  const serviceData = [
    {
      name: 'Threading (Eyebrows & Upper Lip)',
      description: 'Precise threading for shape and contour using organic cotton thread.',
      duration: 15,
      price: 150,
      category: 'Threading',
    },
    {
      name: 'Classic Full Arms & Legs Waxing',
      description: 'Smooth skin with traditional honey wax, removing hair from roots.',
      duration: 45,
      price: 600,
      category: 'Waxing',
    },
    {
      name: 'Rica Liposoluble Waxing (Full Body)',
      description: 'Premium Italian wax suitable for sensitive skin, reduces tan and slows hair regrowth.',
      duration: 90,
      price: 1800,
      category: 'Waxing',
    },
    {
      name: 'O3+ Bridal Glow Facial',
      description: 'Premium skin brightening and deep cleansing facial for an instant bridal glow.',
      duration: 60,
      price: 2500,
      category: 'Facial',
    },
    {
      name: 'De-Tan Therapy (Face & Neck)',
      description: 'Instant tan removal using natural fruit acids and clove oil pack.',
      duration: 30,
      price: 450,
      category: 'De-Tan',
    },
    {
      name: 'Loreal Hair Spa & Nourishment',
      description: 'Deep conditioning treatment for dry, damaged hair with relaxing head massage.',
      duration: 45,
      price: 1200,
      category: 'Hair',
    },
    {
      name: 'Haircut & Blow Dry (Women)',
      description: 'Trendy haircut tailored to your style, followed by professional blow-dry.',
      duration: 45,
      price: 800,
      category: 'Hair',
    },
    {
      name: 'Beard Styling & Shave (Men)',
      description: 'Classic hot towel shave or beard shaping with premium beard oil finish.',
      duration: 30,
      price: 350,
      category: 'Grooming',
    },
    {
      name: 'Traditional Henna/Mehendi (Hands)',
      description: 'Beautiful traditional Indian Henna designs for both hands.',
      duration: 120,
      price: 1500,
      category: 'Henna',
    },
    {
      name: 'Bridal / Party Makeup',
      description: 'Flawless HD makeup with hairstyling, saree draping and eyelash extensions.',
      duration: 150,
      price: 8000,
      category: 'Makeup',
    }
  ];

  const services = await Promise.all(
    serviceData.map((data) => prisma.service.create({ data }))
  );
  console.log('Created services:', services.length);

  // Create a test user (and stylist)
  const testUser = await prisma.user.create({
    data: {
      email: 'test@example.com',
      passwordHash: '$2b$10$VrOe06Z7z4Dv00YqfVqX3eXx6V9Z7Z6V5Z4V3Z2V1Z0Z9Z8Z7Z6Z5Z4', // Hashed 'Test@123'
      name: 'Test User',
      role: 'USER',
    },
  });
  console.log('Created test user:', testUser.email);

  // Create stylists (with associated users)
  const stylistUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alex@example.com',
        passwordHash: '$2b$10$VrOe06Z7z4Dv00YqfVqX3eXx6V9Z7Z6V5Z4V3Z2V1Z0Z9Z8Z7Z6Z5Z4',
        name: 'Alex Rivera',
        role: 'STYLIST',
      },
    }),
    prisma.user.create({
      data: {
        email: 'samantha@example.com',
        passwordHash: '$2b$10$VrOe06Z7z4Dv00YqfVqX3eXx6V9Z7Z6V5Z4V3Z2V1Z0Z9Z8Z7Z6Z5Z4',
        name: 'Samantha Lee',
        role: 'STYLIST',
      },
    }),
    prisma.user.create({
      data: {
        email: 'marcus@example.com',
        passwordHash: '$2b$10$VrOe06Z7z4Dv00YqfVqX3eXx6V9Z7Z6V5Z4V3Z2V1Z0Z9Z8Z7Z6Z5Z4',
        name: 'Marcus Chen',
        role: 'STYLIST',
      },
    }),
  ]);

  const stylists = await Promise.all(
    stylistUsers.map((user, index) =>
      prisma.stylist.create({
        data: {
          userId: user.id,
          bio: [
            'Master stylist with 10+ years of experience in modern cuts and coloring.',
            'Keratin treatment specialist and award-winning colorist.',
            'Expert in textured hair and creative styling.',
          ][index],
          specialities: [
            'Haircut,Coloring,Balayage',
            'Keratin,Coloring,Styling',
            'Haircut,Styling,Textured Hair',
          ][index],
          rating: [4.9, 4.8, 4.7][index],
          isAvailable: true,
        },
      })
    )
  );
  console.log('Created stylists:', stylists.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
