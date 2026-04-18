import crypto from 'node:crypto';

import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { z } from 'zod';

import { db } from '@/lib/db';
import { ensureDatabase } from '@/lib/db-setup';
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
  birthDate: Date;
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
          birthDate: input.birthDate,
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
