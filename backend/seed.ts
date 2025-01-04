import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const items = [
  {
    name: 'MacBook Pro',
    description: '14-inch, M2 Pro chip, 16GB RAM, 512GB SSD',
    price: 1999.99,
  },
  {
    name: 'iPhone 15 Pro',
    description: '256GB, Titanium, Pro Camera System',
    price: 1099.99,
  },
  {
    name: 'AirPods Pro',
    description: '2nd generation, Active Noise Cancellation',
    price: 249.99,
  },
  {
    name: 'iPad Air',
    description: '10.9-inch, M1 chip, 256GB, Wi-Fi',
    price: 749.99,
  },
  {
    name: 'Apple Watch Series 8',
    description: '45mm, GPS + Cellular, Aluminum Case',
    price: 499.99,
  },
];

async function main() {
  console.log('Start seeding...');
  
  // Clear existing data
  await prisma.item.deleteMany();
  
  // Insert seed data
  for (const item of items) {
    const createdItem = await prisma.item.create({
      data: item,
    });
    console.log(`Created item with ID: ${createdItem.id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 