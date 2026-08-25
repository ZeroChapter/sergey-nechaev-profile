import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg/dist/index.js';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set');
}

const adapter = new PrismaPg(connectionString);
const prisma = new PrismaClient({ adapter });

const profileData = {
  name: 'Нечаев Сергей',
  email: '79267646963vk@gmail.com',
  phone: '+79773701743',
  github: 'https://github.com/ZeroChapter',
  blog: 'https://cv-lending.vercel.app/ru/',
};

async function main() {
  try {
    const existingProfile = await prisma.profile.findFirst();

    if (existingProfile) {
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data: profileData,
      });
      return;
    }

    await prisma.profile.create({
      data: profileData,
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
