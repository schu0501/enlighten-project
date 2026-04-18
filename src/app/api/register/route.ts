import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';

import { createParentWithChild, readSessionSafely, savePrimaryChildProfileForEmail } from '@/lib/auth';
import { db } from '@/lib/db';
import { ensureDatabase } from '@/lib/db-setup';
import { parseCalendarDate } from '@/lib/age';
import { validateChildProfileInput, validateRegisterInput } from '@/lib/register-validation';

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}

export async function POST(request: Request) {
  await ensureDatabase(db);
  const session = await readSessionSafely();
  const signedInEmail = session?.user?.email?.trim().toLowerCase();

  const body = await request.json();
  const shapeCheck = z
    .object({
      email: z.unknown().optional(),
      password: z.unknown().optional(),
      nickname: z.unknown(),
      gender: z.unknown(),
      birthDate: z.unknown(),
      interestTags: z.array(z.string()).optional(),
      developmentSignalTags: z.array(z.string()).optional(),
    })
    .safeParse(body);

  if (!shapeCheck.success) {
    return NextResponse.json({ message: '请填写完整的注册信息。' }, { status: 400 });
  }

  const payload = {
    email: String(shapeCheck.data.email ?? ''),
    password: String(shapeCheck.data.password ?? ''),
    nickname: String(shapeCheck.data.nickname ?? ''),
    gender: String(shapeCheck.data.gender ?? ''),
    birthDate: String(shapeCheck.data.birthDate ?? ''),
    interestTags: shapeCheck.data.interestTags ?? [],
    developmentSignalTags: shapeCheck.data.developmentSignalTags ?? [],
  };

  if (signedInEmail) {
    const validated = validateChildProfileInput(payload);

    if (!validated.success) {
      return NextResponse.json({ message: validated.message }, { status: 400 });
    }

    const child = await savePrimaryChildProfileForEmail({
      email: signedInEmail,
      nickname: validated.data.nickname,
      gender: validated.data.gender,
      birthDate: parseCalendarDate(validated.data.birthDate),
      interestTags: validated.data.interestTags ?? [],
      developmentSignalTags: validated.data.developmentSignalTags ?? [],
    });

    if (!child) {
      return NextResponse.json({ message: '当前账号不可用，请重新登录后再试。' }, { status: 401 });
    }

    return NextResponse.json({ ok: true, mode: 'profile' }, { status: 200 });
  }

  const validated = validateRegisterInput(payload);

  if (!validated.success) {
    return NextResponse.json({ message: validated.message }, { status: 400 });
  }

  const email = validated.data.email;
  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return NextResponse.json({ message: '这个邮箱已经注册过了。' }, { status: 409 });
  }

  try {
    await createParentWithChild({
      email,
      password: validated.data.password,
      nickname: validated.data.nickname,
      gender: validated.data.gender,
      birthDate: parseCalendarDate(validated.data.birthDate),
      interestTags: validated.data.interestTags ?? [],
      developmentSignalTags: validated.data.developmentSignalTags ?? [],
    });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ message: '这个邮箱已经注册过了。' }, { status: 409 });
    }

    throw error;
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
