import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  it('loads the singleton profile with nested collections', async () => {
    const findFirst = jest.fn().mockResolvedValue({
      id: 'profile-1',
      name: 'Sergey',
      experiences: [],
      projects: [],
      skills: [],
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: { profile: { findFirst } },
        },
      ],
    }).compile();

    const service = moduleRef.get(ProfileService);
    const profile = await service.findSingleton();

    expect(findFirst).toHaveBeenCalledWith({
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        projects: {
          orderBy: { name: 'asc' },
          include: { skills: { orderBy: { name: 'asc' } } },
        },
        skills: { orderBy: { name: 'asc' } },
      },
    });
    expect(profile?.id).toBe('profile-1');
  });
});
