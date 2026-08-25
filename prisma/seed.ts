import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
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

const experiences = [
  {
    company: 'Independent',
    role: 'TypeScript Backend Developer',
    startDate: new Date('2024-01-01'),
    endDate: null,
    description: 'NestJS, Prisma, GraphQL and relational databases.',
  },
];

const projects = [
  {
    name: 'Digital developer profile',
    summary: 'Public GraphQL business card built with NestJS and Prisma.',
    url: null,
    repoUrl: 'https://github.com/ZeroChapter/sergey-nechaev-profile',
  },
];

const skills = [
  { name: 'TypeScript' },
  { name: 'NestJS' },
  { name: 'Prisma' },
  { name: 'GraphQL' },
];

async function main() {
  try {
    const existingProfile = await prisma.profile.findFirst();

    if (existingProfile) {
      await prisma.profile.update({
        where: { id: existingProfile.id },
        data: {
          ...profileData,
          experiences: {
            deleteMany: {},
            create: experiences,
          },
          projects: {
            deleteMany: {},
            create: projects,
          },
          skills: {
            deleteMany: {},
            create: skills,
          },
        },
      });
      return;
    }

    await prisma.profile.create({
      data: {
        ...profileData,
        experiences: { create: experiences },
        projects: { create: projects },
        skills: { create: skills },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
