import Link from 'next/link';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { getAgeLabelInChinese } from '@/lib/age';

export default async function TodayPage() {
  const session = await auth();
  const email = session?.user?.email;

  const child = email
    ? await db.childProfile.findFirst({
        where: {
          isPrimary: true,
          user: {
            email,
          },
        },
      })
    : null;

  if (!child) {
    return (
      <main className='mx-auto flex min-h-screen max-w-3xl flex-col gap-4 px-6 py-12'>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>今日陪伴</h1>
        <p className='text-lg leading-8 text-stone-700'>
          先创建或登录家长账号，再保存孩子生日，系统就能按年龄展示陪伴建议。
        </p>
        <Link className='text-stone-900 underline underline-offset-4' href='/register'>
          去创建档案
        </Link>
      </main>
    );
  }

  const ageLabel = getAgeLabelInChinese(child.birthDate, new Date());

  return (
    <main className='mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-6 py-12'>
      <section className='grid gap-3'>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>今日陪伴</h1>
        <p className='text-lg leading-8 text-stone-700'>
          {child.nickname} · {ageLabel}
        </p>
      </section>
      <article className='rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>先从一个 10 分钟的小任务开始</h2>
        <p className='mt-3 text-base leading-7 text-stone-700'>
          你现在可以围绕 {child.nickname} 的年龄，先做一个轻量、可完成的陪伴动作。
        </p>
      </article>
      <Link className='text-stone-900 underline underline-offset-4' href='/profile'>
        编辑孩子档案
      </Link>
    </main>
  );
}
