import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';

describe('Profile GraphQL (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({
        $connect: jest.fn(),
        $disconnect: jest.fn(),
        onModuleInit: jest.fn(),
        onModuleDestroy: jest.fn(),
        profile: {
          findFirst: jest.fn().mockResolvedValue({
            id: 'profile-1',
            name: 'Нечаев Сергей',
            email: 'dev@example.com',
            phone: '+10000000000',
            github: null,
            blog: null,
            avatarUrl: null,
            experiences: [],
            projects: [],
            skills: [{ id: 'skill-1', name: 'TypeScript' }],
          }),
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('returns the singleton profile query', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: '{ profile { name skills { name } } }',
      })
      .expect(200);

    const body = response.body as {
      data: { profile: { name: string; skills: { name: string }[] } };
    };

    expect(body.data.profile.name).toBe('Нечаев Сергей');
    expect(body.data.profile.skills).toEqual([{ name: 'TypeScript' }]);
  });

  afterEach(async () => {
    await app.close();
  });
});
