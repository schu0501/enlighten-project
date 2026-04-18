import Link from 'next/link';

import { ChildProfileForm } from '@/components/profile/child-profile-form';

export default function RegisterPage() {
  return (
    <main className='mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12'>
      <section className='grid gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-amber-700'>
          Parent-guided enlightenment
        </p>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>创建孩子档案</h1>
        <p className='max-w-2xl text-lg leading-8 text-stone-700'>
          先把家长账号和孩子出生日期建好，系统就能从今天开始给出更贴近年龄的陪伴建议。
        </p>
      </section>
      <ChildProfileForm />
      <p className='text-sm text-stone-600'>
        已经有账号了？
        <Link className='ml-2 font-medium text-stone-900 underline underline-offset-4' href='/login'>
          直接登录
        </Link>
      </p>
    </main>
  );
}
