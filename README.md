# Цифровая визитка — Сергей Нечаев

Публичный профиль разработчика. Backend: NestJS, GraphQL, Prisma, CockroachDB. Frontend: Vite + React.

API только для чтения. Данные меняются через Prisma seed, не через GraphQL.

## Стек

- TypeScript, Node.js, NestJS
- GraphQL (code-first, Apollo)
- Prisma
- CockroachDB
- Docker Compose (база)
- Vite + React (`client/`)

## Требования

- Node.js 22+
- Docker Desktop
- npm

## Запуск

Первый раз:

```powershell
cd sergey-nechaev-profile
copy .env.example .env
npm install
npm run setup
npm run dev
```

`npm install` ставит зависимости бэкенда и фронта.  
`npm run setup` поднимает CockroachDB, применяет миграции и заполняет seed.  
`npm run dev` поднимает API и визитку вместе.

Дальше достаточно:

```powershell
npm run dev
```

- Визитка: http://localhost:5173
- API / GraphiQL: http://localhost:3000/graphql
- Cockroach UI: http://localhost:8080

Локально Vite проксирует `/graphql` на API.

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
| `npm run dev` | База + API + фронт |
| `npm run setup` | Миграции и seed |
| `npm run start:dev` | Только API |
| `npm run client:dev` | Только фронт |
| `npm run build` | Сборка API |
| `npm run start:prod` | Запуск собранного `dist` |
| `npm test` | Unit-тесты |
| `npm run test:e2e` | GraphQL e2e |
| `npx prisma db seed` | Обновить данные профиля |
| `npx prisma studio` | Просмотр БД |
| `npm run client:build` | Сборка статики в `client/dist` |
| `npm --prefix client run lint` | ESLint Airbnb для `client/src` |

Изменить содержимое визитки: правки в `prisma/seed.ts`, затем `npx prisma db seed`.
