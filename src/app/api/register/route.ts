import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createParentWithChild } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensureDatabase } from '@/lib/db-setup';
import { parseCalendarDate } from '@/lib/age';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nickname: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export async function POST(request: Request) {
  await ensureDatabase(db);

  const body = await request.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: '请填写完整的邮箱、密码、孩子昵称和出生日期。' },
      { status: 400 },
    );
  }

  const email = parsed.data.email.trim().toLowerCase();
  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ message: '这个邮箱已经注册过了。' }, { status: 409 });
  }

  try {
    await createParentWithChild({
      email,
      password: parsed.data.password,
      nickname: parsed.data.nickname,
      birthDate: parseCalendarDate(parsed.data.birthDate),
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ message: '这个邮箱已经注册过了。' }, { status: 409 });
    }

    throw error;
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
