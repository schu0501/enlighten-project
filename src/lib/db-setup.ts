import { PrismaClient } from '@prisma/client';

import { db } from './db.ts';

const statements = [
  'PRAGMA foreign_keys = ON;',
  'CREATE TABLE IF NOT EXISTS "User" (id TEXT PRIMARY KEY NOT NULL, email TEXT NOT NULL UNIQUE, passwordHash TEXT NOT NULL, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP);',
  'CREATE TABLE IF NOT EXISTS "ChildProfile" (id TEXT PRIMARY KEY NOT NULL, userId TEXT NOT NULL, nickname TEXT NOT NULL, gender TEXT NOT NULL DEFAULT \'\', birthDate DATETIME NOT NULL, isPrimary INTEGER NOT NULL DEFAULT 1, createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (userId) REFERENCES "User"(id) ON DELETE CASCADE);',
  'ALTER TABLE "ChildProfile" ADD COLUMN "gender" TEXT NOT NULL DEFAULT \'\';',
  'ALTER TABLE "ChildProfile" ADD COLUMN "interestTags" TEXT NOT NULL DEFAULT \'[]\';',
  'ALTER TABLE "ChildProfile" ADD COLUMN "developmentSignalTags" TEXT NOT NULL DEFAULT \'[]\';',
  'CREATE INDEX IF NOT EXISTS "ChildProfile_userId_idx" ON "ChildProfile"(userId);',
  'DROP INDEX IF EXISTS "ChildProfile_userId_isPrimary_key";',
  'CREATE UNIQUE INDEX IF NOT EXISTS "ChildProfile_primary_userId_idx" ON "ChildProfile"(userId) WHERE isPrimary = 1;',
];

export async function ensureDatabase(client: PrismaClient = db) {
  for (const statement of statements) {
    try {
      await client.$executeRawUnsafe(statement);
    } catch (error) {
      if (error instanceof Error && /duplicate column name/i.test(error.message)) {
        continue;
      }

      throw error;
    }
  }
}
