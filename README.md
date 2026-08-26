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

## Деплой на Render

Один Docker-контейнер: Nest + одноузловой CockroachDB в том же образе.

База не вынесена в CockroachDB Cloud: страница входа/регистрации отвечала **403** вместо формы, зарегистрироваться не получилось. Render не запускает `docker compose`, поэтому Cockroach стартует внутри того же контейнера, что и API.

1. Запушьте репозиторий на GitHub.
2. Render: **New → Web Service** → этот репозиторий.
3. Runtime: **Docker**. Plan: **Free**.
4. `NODE_ENV=production`. `PORT` Render задаёт сам. `DATABASE_URL` не нужен — контейнер поднимает Cockroach на `127.0.0.1:26257`.

Либо Blueprint из `render.yaml`.

При старте: Cockroach → `prisma migrate deploy` → seed → API. Данные на диске эфемерные и заново сидятся после сна/деплоя — для демо это ожидаемо.

Визитка: `https://<service>.onrender.com`, GraphQL: `/graphql`.

Free-инстанс — 512 MB RAM. Cockroach ограничен `--cache=64MiB` / `--max-sql-memory=128MiB`. Если сервис падает с OOM, поднимите план выше Free.

Чтобы использовать внешнюю базу: задайте `DATABASE_URL` и `SKIP_EMBEDDED_COCKROACH=true`.
