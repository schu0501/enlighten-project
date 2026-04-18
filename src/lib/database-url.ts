import { closeSync, existsSync, mkdirSync, openSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function fallbackDatabasePath() {
  return resolve(process.cwd(), 'prisma', 'dev.db');
}

function toFileUrl(filePath: string) {
  return `file:${filePath.replace(/\\/g, '/')}`;
}

function resolveDatabaseFilePath(databaseUrl: string) {
  if (databaseUrl.startsWith('file:')) {
    const configuredPath = databaseUrl.slice('file:'.length);

    if (configuredPath.startsWith('/')) {
      return configuredPath;
    }

    if (/^[A-Za-z]:[\\/]/.test(configuredPath)) {
      return configuredPath;
    }

    return resolve(process.cwd(), configuredPath);
  }

  if (/^[A-Za-z]:[\\/]/.test(databaseUrl) || databaseUrl.startsWith('/')) {
    return databaseUrl;
  }

  return resolve(process.cwd(), databaseUrl);
}

export function getStableDatabaseUrl() {
  const configuredUrl = process.env.DATABASE_URL?.trim();

  if (configuredUrl) {
    return configuredUrl;
  }

  return toFileUrl(fallbackDatabasePath());
}

export function ensureDatabaseFile() {
  const databasePath = resolveDatabaseFilePath(getStableDatabaseUrl());
  mkdirSync(dirname(databasePath), { recursive: true });

  if (!existsSync(databasePath)) {
    const handle = openSync(databasePath, 'a');
    closeSync(handle);
  }
}
