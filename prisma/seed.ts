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

const skills = [
  { name: 'TypeScript' },
  { name: 'React' },
  { name: 'NestJS' },
  { name: 'Prisma' },
  { name: 'GraphQL' },
  { name: 'Docker' },
  { name: 'Git' },
  { name: 'Next.js' },
  { name: 'Tailwind CSS' },
  { name: 'HTML' },
  { name: 'CSS' },
  { name: 'JavaScript' },
  { name: 'Node.js' },
  { name: 'MongoDB' },
];

const projects = [
  {
    name: 'Art Nexus',
    summary:
      'Интернет магазин дизайнерской одежды. Фронтенд - Next.js, бэкенд - Express, база данных - MongoDB.',
    url: 'https://art-nexus.ru/',
    repoUrl: [
      'https://github.com/ZeroChapter/sergey-nechaev-profile',
      'https://github.com/ZeroChapter/Art-nexus-back',
      'https://github.com/ZeroChapter/ArtNexusAdmin',
    ],
    skillNames: [
      'TypeScript',
      'JavaScript',
      'Next.js',
      'Node.js',
      'MongoDB',
      'HTML',
      'CSS',
      'Git',
    ],
  },
  {
    name: 'CV Сергей Нечаев',
    summary:
      'Мой личный сайт-портфолио. Фронтенд - Astro, бэкенд и БД в проекте отсутствуют.',
    url: 'https://cv-lending.vercel.app/ru/',
    repoUrl: ['https://github.com/ZeroChapter/CV_lending'],
    skillNames: ['TypeScript', 'JavaScript', 'HTML', 'CSS', 'Git'],
  },
  {
    name: 'Заигрыш',
    summary:
      'Проект для музыкальных встречь и обучению народной музыке. В проекте я выступал в роли frontend разработчика (репозиторий закрыт по просьбе заказчика).',
    url: 'https://заигрыш.рф/',
    repoUrl: ['https://gitlab.com/rustrad-projects/Rustrad'],
    skillNames: [
      'TypeScript',
      'JavaScript',
      'Next.js',
      'HTML',
      'Tailwind CSS',
      'Git',
    ],
  },
];

function connectSkills(profileId: string, skillNames: string[]) {
  return {
    connect: skillNames.map((name) => ({
      profileId_name: { profileId, name },
    })),
  };
}

async function main() {
  try {
    const existingProfile = await prisma.profile.findFirst();

    const profile = existingProfile
      ? await prisma.profile.update({
          where: { id: existingProfile.id },
          data: {
            ...profileData,
            projects: { deleteMany: {} },
          },
        })
      : await prisma.profile.create({
          data: profileData,
        });

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        experiences: {
          deleteMany: {},
          create: experiences,
        },
        skills: {
          deleteMany: {},
          create: skills,
        },
      },
    });

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        projects: {
          create: projects.map(({ skillNames, ...project }) => ({
            ...project,
            skills: connectSkills(profile.id, skillNames),
          })),
        },
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
