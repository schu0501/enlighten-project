import { closeSync, existsSync, mkdirSync, openSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function fallbackDatabasePath() {
  return resolve(process.cwd(), 'prisma', 'dev.db');
}

function toFileUrl(filePath: string) {
  return `file:${filePath.replace(/\\/g, '/')}`;
}

export function getStableDatabaseUrl() {
  const fallbackPath = fallbackDatabasePath();
  const fallbackUrl = toFileUrl(fallbackPath);
  const configuredUrl = process.env.DATABASE_URL?.trim();

  if (!configuredUrl || configuredUrl.startsWith('file:./') || configuredUrl.startsWith('file:../')) {
    return fallbackUrl;
  }

  if (configuredUrl.startsWith('file:')) {
    const configuredPath = configuredUrl.slice('file:'.length);

    if (configuredPath.startsWith('/')) {
      return toFileUrl(configuredPath);
    }

    if (/^[A-Za-z]:[\\/]/.test(configuredPath)) {
      return toFileUrl(configuredPath);
    }
  }

  return fallbackUrl;
}

export function ensureDatabaseFile() {
  const databasePath = fallbackDatabasePath();
  mkdirSync(dirname(databasePath), { recursive: true });

  if (!existsSync(databasePath)) {
    const handle = openSync(databasePath, 'a');
    closeSync(handle);
  }
}
