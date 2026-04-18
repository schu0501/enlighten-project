import crypto from 'node:crypto';

import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { z } from 'zod';

import { db } from '@/lib/db';
import { ensureDatabase } from '@/lib/db-setup';
import { parseStoredTags, serializeTags } from './child-tags';
import { resolveNextAuthSecret } from './nextauth-secret';

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const saltLength = 16;
const keyLength = 64;

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(saltLength).toString('hex');
  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keyLength, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result as Buffer);
    });
  });

  return salt + ':' + derived.toString('hex');
}

export async function verifyPassword(password: string, storedPassword: string) {
  const [salt, storedHash] = storedPassword.split(':');

  if (!salt || !storedHash) {
    return false;
  }

  const derived = await new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(password, salt, keyLength, (error, result) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(result as Buffer);
    });
  });

  const derivedHash = derived.toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(derivedHash, 'hex'));
}

export async function createParentWithChild(input: {
  email: string;
  password: string;
  nickname: string;
  gender: string;
  birthDate: Date;
  interestTags: string[];
  developmentSignalTags: string[];
}) {
  await ensureDatabase(db);

  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);

  return db.user.create({
    data: {
      email,
      passwordHash,
      children: {
        create: {
          nickname: input.nickname.trim(),
          gender: input.gender,
          birthDate: input.birthDate,
          interestTags: serializeTags(input.interestTags),
          developmentSignalTags: serializeTags(input.developmentSignalTags),
          isPrimary: true,
        },
      },
    },
    include: {
      children: true,
    },
  });
}

export async function getPrimaryChildForEmail(email: string) {
  await ensureDatabase(db);

  return db.childProfile.findFirst({
    where: {
      isPrimary: true,
      user: {
        email: email.trim().toLowerCase(),
      },
    },
    include: {
      user: true,
    },
  });
}

export async function updatePrimaryChildPreferencesForEmail(input: {
  email: string;
  interestTags: string[];
  developmentSignalTags: string[];
}) {
  await ensureDatabase(db);

  const child = await getPrimaryChildForEmail(input.email);

  if (!child) {
    return null;
  }

  return db.childProfile.update({
    where: {
      id: child.id,
    },
    data: {
      interestTags: serializeTags(input.interestTags),
      developmentSignalTags: serializeTags(input.developmentSignalTags),
    },
    include: {
      user: true,
    },
  });
}

export async function savePrimaryChildProfileForEmail(input: {
  email: string;
  nickname: string;
  gender: string;
  birthDate: Date;
  interestTags: string[];
  developmentSignalTags: string[];
}) {
  await ensureDatabase(db);

  const child = await getPrimaryChildForEmail(input.email);

  if (child) {
    return db.childProfile.update({
      where: {
        id: child.id,
      },
      data: {
        nickname: input.nickname.trim(),
        gender: input.gender,
        birthDate: input.birthDate,
        interestTags: serializeTags(input.interestTags),
        developmentSignalTags: serializeTags(input.developmentSignalTags),
      },
      include: {
        user: true,
      },
    });
  }

  const user = await db.user.findUnique({
    where: {
      email: input.email.trim().toLowerCase(),
    },
  });

  if (!user) {
    return null;
  }

  return db.childProfile.create({
    data: {
      userId: user.id,
      nickname: input.nickname.trim(),
      gender: input.gender,
      birthDate: input.birthDate,
      interestTags: serializeTags(input.interestTags),
      developmentSignalTags: serializeTags(input.developmentSignalTags),
      isPrimary: true,
    },
    include: {
      user: true,
    },
  });
}

export async function updatePrimaryChildProfileDetailsForEmail(input: {
  email: string;
  birthDate?: Date;
  gender?: string;
  interestTags?: string[];
  developmentSignalTags?: string[];
}) {
  await ensureDatabase(db);

  const child = await getPrimaryChildForEmail(input.email);

  if (!child) {
    return null;
  }

  return db.childProfile.update({
    where: {
      id: child.id,
    },
    data: {
      ...(input.birthDate ? { birthDate: input.birthDate } : {}),
      ...(input.gender !== undefined ? { gender: input.gender } : {}),
      ...(input.interestTags ? { interestTags: serializeTags(input.interestTags) } : {}),
      ...(input.developmentSignalTags ? { developmentSignalTags: serializeTags(input.developmentSignalTags) } : {}),
    },
    include: {
      user: true,
    },
  });
}

export function readChildPreferenceTags(child: {
  interestTags: string;
  developmentSignalTags: string;
}) {
  return {
    interestTags: parseStoredTags(child.interestTags),
    developmentSignalTags: parseStoredTags(child.developmentSignalTags),
  };
}

export async function readSessionSafely() {
  try {
    return await auth();
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes('no matching decryption secret') ||
        error.message.includes('JWTSessionError') ||
        error.message.includes('JWEInvalid'))
    ) {
      return null;
    }

    throw error;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: resolveNextAuthSecret(),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      authorize: async (credentials) => {
        await ensureDatabase(db);

        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: parsed.data.email.trim().toLowerCase(),
          },
        });

        if (!user) {
          return null;
        }

        const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);

        if (!validPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.email,
        };
      },
    }),
  ],
});
