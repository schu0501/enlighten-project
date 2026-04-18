import { NextResponse } from 'next/server';
import { z } from 'zod';

import { parseCalendarDate } from '@/lib/age';
import { readSessionSafely, updatePrimaryChildProfileDetailsForEmail, updatePrimaryChildPreferencesForEmail } from '@/lib/auth';
import { DEVELOPMENT_SIGNAL_TAGS, INTEREST_TAGS, filterAllowedTags } from '@/lib/child-tags';
import { isValidGender } from '@/lib/child-profile-options';

const profileSchema = z.object({
  birthDate: z.string().optional(),
  gender: z.string().optional(),
  interestTags: z.array(z.string()).optional(),
  developmentSignalTags: z.array(z.string()).optional(),
});

export async function PATCH(request: Request) {
  const session = await readSessionSafely();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ message: '请先登录后再修改档案。' }, { status: 401 });
  }

  const body = await request.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ message: '请提供有效的偏好标签。' }, { status: 400 });
  }

  if (parsed.data.birthDate !== undefined || parsed.data.gender !== undefined) {
    if (!parsed.data.birthDate?.trim()) {
      return NextResponse.json({ message: '请选择出生日期。' }, { status: 400 });
    }

    let birthDate: Date;

    try {
      birthDate = parseCalendarDate(parsed.data.birthDate);
    } catch {
      return NextResponse.json({ message: '请选择有效的出生日期。' }, { status: 400 });
    }

    const today = new Date();
    const localToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    if (birthDate > localToday) {
      return NextResponse.json({ message: '出生日期不能晚于今天。' }, { status: 400 });
    }

    if (!isValidGender(parsed.data.gender)) {
      return NextResponse.json({ message: '请选择孩子性别。' }, { status: 400 });
    }

    const interestTags = filterAllowedTags(parsed.data.interestTags ?? [], INTEREST_TAGS);
    const developmentSignalTags = filterAllowedTags(parsed.data.developmentSignalTags ?? [], DEVELOPMENT_SIGNAL_TAGS);

    const updatedChild = await updatePrimaryChildProfileDetailsForEmail({
      email,
      birthDate,
      gender: parsed.data.gender,
      interestTags,
      developmentSignalTags,
    });

    if (!updatedChild) {
      return NextResponse.json({ message: '还没有可更新的孩子档案。' }, { status: 404 });
    }

    return NextResponse.json({
      ok: true,
      birthDate: parsed.data.birthDate,
      gender: parsed.data.gender,
      interestTags,
      developmentSignalTags,
    });
  }

  const interestTags = filterAllowedTags(parsed.data.interestTags ?? [], INTEREST_TAGS);
  const developmentSignalTags = filterAllowedTags(parsed.data.developmentSignalTags ?? [], DEVELOPMENT_SIGNAL_TAGS);
  const updatedChild = await updatePrimaryChildPreferencesForEmail({
    email,
    interestTags,
    developmentSignalTags,
  });

  if (!updatedChild) {
    return NextResponse.json({ message: '还没有可更新的孩子档案。' }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    interestTags,
    developmentSignalTags,
  });
}
