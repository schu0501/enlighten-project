import { PrismaClient } from '@prisma/client';

import { ensureDatabaseFile, getStableDatabaseUrl } from './database-url';

ensureDatabaseFile();
process.env.DATABASE_URL = getStableDatabaseUrl();

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = globalThis.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = db;
}
