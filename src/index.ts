import { PrismaClient } from '@prisma/client';
import { logger, setWizardConfig } from 'console-wizard';
import * as dotenv from 'dotenv';
import { Byte } from './lib';

if (!process.env.NODE_ENV) {
  logger.error('NODE_ENV not found!', { includeTimestamp: false });
  process.exit(1);
}

dotenv.config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`,
});

// Sentry
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [new ProfilingIntegration()],
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});

setWizardConfig({
  includeSN: true,
  includeStatus: true,
  includeTimestamp: true,
});

export const client = new Byte();
export const prisma = new PrismaClient();

client.deploy();
