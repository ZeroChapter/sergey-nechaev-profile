# Цифровая визитка — Сергей Нечаев

Публичный профиль разработчика. Backend: NestJS, GraphQL, Prisma, CockroachDB.

API только для чтения. Данные меняются через Prisma seed, не через GraphQL.

## Стек

- TypeScript, Node.js, NestJS
- GraphQL (code-first, Apollo)
- Prisma
- CockroachDB
- Docker Compose (база)

## Требования

- Node.js 22+
- Docker Desktop
- npm

## Запуск

```powershell
cd sergey-nechaev-profile
copy .env.example .env
docker compose up -d
npm install
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run start:dev
```

Приложение: http://localhost:3000  
GraphQL (GraphiQL): http://localhost:3000/graphql  

Cockroach UI: http://localhost:8080

`DATABASE_URL` и `PORT` задаются в `.env`. Файл `.env` в Git не коммитится.

## GraphQL

Один публичный query: `profile`. Mutations нет.

```graphql
{
  profile {
    name
    email
    phone
    github
    blog
    avatarUrl
    experiences {
      company
      role
      startDate
      endDate
      description
    }
    projects {
      name
      summary
      url
      repoUrl
      skills {
        name
      }
    }
    skills {
      name
    }
  }
}
```

Контракт также лежит в `src/schema.gql` (генерируется NestJS).

## Скрипты

| Команда | Назначение |
|---|---|
| `npm run start:dev` | API в watch-режиме |
| `npm run build` | Сборка |
| `npm run start:prod` | Запуск собранного `dist` |
| `npm test` | Unit-тесты |
| `npm run test:e2e` | GraphQL e2e |
| `npx prisma db seed` | Заполнить/обновить данные профиля |
| `npx prisma studio` | Просмотр БД |

Изменить содержимое визитки: правки в `prisma/seed.ts`, затем `npx prisma db seed`.
