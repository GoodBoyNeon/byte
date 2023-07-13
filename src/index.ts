import { config } from 'dotenv';
import { logger, setWizardConfig } from 'console-wizard';
import { Byte } from './lib';

setWizardConfig({
  includeSN: true,
  includeStatus: true,
  includeTimestamp: true,
});

if (!process.env.NODE_ENV) {
  logger.error('NODE_ENV not found!', { includeTimestamp: false });
  process.exit(1);
}

config({
  path: `${__dirname}/../.env.${process.env.NODE_ENV}`,
});

export const client = new Byte();

client.deploy();
