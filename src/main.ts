import 'dotenv/config';
import { spawn, execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import express from 'express';

function run(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      env: process.env,
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`${command} ${args.join(' ')} exited with ${code}`));
    });
  });
}

async function waitForCockroach() {
  for (let i = 0; i < 60; i += 1) {
    try {
      execFileSync(
        'cockroach',
        ['sql', '--insecure', '--host=127.0.0.1', '--port=26257', '-e', 'SELECT 1'],
        { stdio: 'ignore' },
      );
      return;
    } catch {
      await delay(1000);
    }
  }
  throw new Error('CockroachDB did not become ready');
}

async function applySqlMigrations() {
  const file = join(process.cwd(), 'prisma', 'init.sql');
  console.log('Applying prisma/init.sql');
  await run('cockroach', [
    'sql',
    '--insecure',
    '--host=127.0.0.1',
    '--port=26257',
    '-f',
    file,
  ]);
}

async function prepareDatabase() {
  if (process.env.SKIP_EMBEDDED_COCKROACH === 'true') {
    const prisma = join(process.cwd(), 'node_modules', '.bin', 'prisma');
    console.log('Running prisma migrate deploy');
    await run(prisma, ['migrate', 'deploy']);
  } else {
    await applySqlMigrations();
  }
  console.log('Running prisma seed');
  await run(process.execPath, [
    '--max-old-space-size=64',
    join(process.cwd(), 'dist', 'seed.js'),
  ]);
  console.log('Database ready');
}

function serveClient(expressApp: express.Express) {
  const clientDist = join(process.cwd(), 'client', 'dist');
  if (!existsSync(clientDist)) {
    return;
  }

  expressApp.use(express.static(clientDist));
  expressApp.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();
      return;
    }
    if (req.path.startsWith('/graphql')) {
      next();
      return;
    }
    res.sendFile(join(clientDist, 'index.html'), (error) => {
      if (error) {
        next(error);
      }
    });
  });
}

async function bootstrap() {
  const port = Number(process.env.PORT ?? 3000);
  const expressApp = express();
  let nestReady = false;

  expressApp.use('/graphql', (_req, res, next) => {
    if (nestReady) {
      next();
      return;
    }
    res.status(503).json({ error: 'starting' });
  });
  serveClient(expressApp);

  const httpServer = createServer(expressApp);
  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Listening on 0.0.0.0:${port}`);
      resolve();
    });
  });

  if (process.env.NODE_ENV === 'production') {
    if (process.env.SKIP_EMBEDDED_COCKROACH !== 'true') {
      await waitForCockroach();
    }
    await prepareDatabase();
  }

  const { NestFactory } = await import('@nestjs/core');
  const { ExpressAdapter } = await import('@nestjs/platform-express');
  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  app.enableCors();
  await app.init();
  nestReady = true;
  console.log('GraphQL ready');
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
