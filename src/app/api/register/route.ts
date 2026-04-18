import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createParentWithChild } from '@/lib/auth';
import { db } from '@/lib/db';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nickname: z.string().min(1),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(request: Request) {
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

  await createParentWithChild({
    email,
    password: parsed.data.password,
    nickname: parsed.data.nickname,
    birthDate: new Date(parsed.data.birthDate + 'T00:00:00.000Z'),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
