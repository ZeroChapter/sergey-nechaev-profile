# Цифровая визитка — Сергей Нечаев

Публичный профиль разработчика. Backend: NestJS, GraphQL, Prisma, CockroachDB.

API только для чтения. Данные меняются через Prisma seed, не через GraphQL.

## Стек

- TypeScript, Node.js, NestJS
- GraphQL (code-first, Apollo)
- Prisma
- CockroachDB
- Docker Compose (база)
- Vite + React (статический клиент в `client/`)

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
npm --prefix client install
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run start:dev
```

Во втором терминале:

```powershell
npm run client:dev
```

API: http://localhost:3000  
GraphQL (GraphiQL): http://localhost:3000/graphql  
Визитка: http://localhost:5173  

Локально Vite проксирует `/graphql` на API.

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
| `npm run client:dev` | Фронт Vite, http://localhost:5173 |
| `npm run client:build` | Сборка статики в `client/dist` |
| `npm --prefix client run lint` | ESLint Airbnb для `client/src` |

Изменить содержимое визитки: правки в `prisma/seed.ts`, затем `npx prisma db seed`.
