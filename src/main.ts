import 'dotenv/config';
import { createServer } from 'node:http';
import { execFileSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import express from 'express';

const BOOT_HTML =
  '<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="3"><title>Starting</title>starting';

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

function prepareDatabase() {
  execFileSync('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit' });
  execFileSync(process.execPath, ['dist/seed.js'], { stdio: 'inherit' });
}

async function bootstrap() {
  const port = Number(process.env.PORT ?? 3000);
  const expressApp = express();
  let nestReady = false;

  expressApp.use((_req, res, next) => {
    if (nestReady) {
      next();
      return;
    }
    res.status(200).type('html').send(BOOT_HTML);
  });

  const httpServer = createServer(expressApp);
  await new Promise<void>((resolve, reject) => {
    httpServer.once('error', reject);
    httpServer.listen(port, '0.0.0.0', () => {
      resolve();
    });
  });

  if (process.env.NODE_ENV === 'production') {
    if (process.env.SKIP_EMBEDDED_COCKROACH !== 'true') {
      await waitForCockroach();
    }
    prepareDatabase();
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
}

bootstrap().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
