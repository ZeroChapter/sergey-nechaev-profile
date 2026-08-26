FROM node:22-bookworm-slim AS build

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
COPY client/package.json client/package-lock.json ./client/
RUN npm ci

COPY . .
RUN npx prisma generate \
  && rm -f tsconfig.build.tsbuildinfo tsconfig.tsbuildinfo \
  && npm --prefix client run build \
  && npm run build \
  && node -e "const ts=require('typescript');const fs=require('fs');const r=ts.transpileModule(fs.readFileSync('prisma/seed.ts','utf8'),{compilerOptions:{module:1,esModuleInterop:true,target:9}});fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/seed.js',r.outputText);"

FROM node:22-bookworm-slim AS runner

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates curl \
  && rm -rf /var/lib/apt/lists/* \
  && curl -fsSL https://binaries.cockroachdb.com/cockroach-v25.2.8.linux-amd64.tgz \
    | tar -xz \
  && cp cockroach-v25.2.8.linux-amd64/cockroach /usr/local/bin/ \
  && rm -rf cockroach-v25.2.8.linux-amd64

WORKDIR /app
ENV NODE_ENV=production
ENV DATABASE_URL=postgresql://root@127.0.0.1:26257/defaultdb?sslmode=disable

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/client/dist ./client/dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/generated ./generated
COPY --from=build /app/src/schema.gql ./src/schema.gql
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' docker-entrypoint.sh && chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
