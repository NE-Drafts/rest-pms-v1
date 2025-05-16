// prisma/seed.ts
import { PrismaClient } from '../src/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@parking.com' },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@parking.com',
      phoneNumber: '07834567890',
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('Admin user created:', admin.email);
}

main()
  .then(() => {
    console.log('Seed complete.');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
