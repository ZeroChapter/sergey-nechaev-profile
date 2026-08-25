import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  findSingleton() {
    return this.prisma.profile.findFirst({
      include: {
        experiences: { orderBy: { startDate: 'desc' } },
        projects: {
          orderBy: { name: 'asc' },
          include: { skills: { orderBy: { name: 'asc' } } },
        },
        skills: { orderBy: { name: 'asc' } },
      },
    });
  }
}
