'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError('邮箱或密码不正确。');
      return;
    }

    router.push('/today');
    router.refresh();
  }

  return (
    <main className='mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-12'>
      <section className='grid gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-amber-700'>
          Parent-guided enlightenment
        </p>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>登录</h1>
        <p className='max-w-2xl text-lg leading-8 text-stone-700'>
          使用家长账号继续查看今天的陪伴建议和孩子档案。
        </p>
      </section>
      <form className='grid gap-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm' onSubmit={handleSubmit}>
        <label className='grid gap-2'>
          <span className='text-sm font-medium text-stone-700'>邮箱</span>
          <input
            className='rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900'
            name='email'
            type='email'
            autoComplete='email'
            required
          />
        </label>
        <label className='grid gap-2'>
          <span className='text-sm font-medium text-stone-700'>密码</span>
          <input
            className='rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900'
            name='password'
            type='password'
            autoComplete='current-password'
            required
          />
        </label>
        {error ? <p className='text-sm text-red-700'>{error}</p> : null}
        <button
          className='rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60'
          type='submit'
          disabled={isSubmitting}
        >
          登录并继续
        </button>
      </form>
      <p className='text-sm text-stone-600'>
        还没有账号？
        <Link className='ml-2 font-medium text-stone-900 underline underline-offset-4' href='/register'>
          去创建档案
        </Link>
      </p>
    </main>
  );
}
