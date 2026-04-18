'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export function ChildProfileForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '').trim();
    const password = String(formData.get('password') ?? '');
    const nickname = String(formData.get('nickname') ?? '').trim();
    const birthDate = String(formData.get('birthDate') ?? '');

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        nickname,
        birthDate,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { message?: string } | null;
      setError(payload?.message ?? '注册失败，请重试。');
      setIsSubmitting(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (signInResult?.error) {
      setError('档案已创建，但登录失败，请使用邮箱和密码重新登录。');
      setIsSubmitting(false);
      return;
    }

    router.replace('/today');
    router.refresh();
  }

  return (
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
          autoComplete='new-password'
          required
        />
      </label>
      <label className='grid gap-2'>
        <span className='text-sm font-medium text-stone-700'>孩子昵称</span>
        <input
          className='rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900'
          name='nickname'
          type='text'
          required
        />
      </label>
      <label className='grid gap-2'>
        <span className='text-sm font-medium text-stone-700'>出生日期</span>
        <input
          className='rounded-2xl border border-stone-300 bg-white px-4 py-3 text-base outline-none transition focus:border-stone-900'
          name='birthDate'
          type='date'
          required
        />
      </label>
      {error ? <p className='text-sm text-red-700'>{error}</p> : null}
      <button
        className='rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60'
        type='submit'
        disabled={isSubmitting}
      >
        创建档案并开始
      </button>
    </form>
  );
}
