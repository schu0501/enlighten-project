import { PrismaClient } from '@prisma/client';

import { db } from './db.ts';

const statements = [
  'PRAGMA foreign_keys = ON;',
  'CREATE TABLE IF NOT EXISTS "User" (id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, passwordHash TEXT NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);',
  'CREATE TABLE IF NOT EXISTS "ChildProfile" (id TEXT PRIMARY KEY NOT NULL, userId TEXT NOT NULL, nickname TEXT NOT NULL, birthDate DATETIME NOT NULL, isPrimary INTEGER NOT NULL DEFAULT 1, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE);',
  'CREATE INDEX IF NOT EXISTS "ChildProfile_userId_idx" ON "ChildProfile"(userId);',
  'DROP INDEX IF EXISTS "ChildProfile_userId_isPrimary_key";',
  'CREATE UNIQUE INDEX IF NOT EXISTS "ChildProfile_primary_userId_idx" ON "ChildProfile"(userId) WHERE isPrimary = 1;',
];

export async function ensureDatabase(client: PrismaClient = db) {
  for (const statement of statements) {
    await client.$executeRawUnsafe(statement);
  }
}
