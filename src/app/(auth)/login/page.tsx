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
    <main className='auth-shell flex min-h-[calc(100vh-4.5rem)] flex-col gap-8'>
      <section className='page-hero'>
        <p className='page-kicker'>Parent-guided enlightenment</p>
        <h1 className='page-title'>登录</h1>
        <p className='page-lead'>
          使用家长账号继续查看今天的陪伴建议和孩子档案。
        </p>
      </section>
      <form className='surface-panel grid gap-5 p-7 sm:p-8' onSubmit={handleSubmit}>
        <label className='grid gap-2'>
          <span className='text-sm font-medium text-[color:var(--text-soft)]'>邮箱</span>
          <input
            className='field-input'
            name='email'
            type='email'
            autoComplete='email'
            required
          />
        </label>
        <label className='grid gap-2'>
          <span className='text-sm font-medium text-[color:var(--text-soft)]'>密码</span>
          <input
            className='field-input'
            name='password'
            type='password'
            autoComplete='current-password'
            required
          />
        </label>
        {error ? <p className='text-sm text-red-700'>{error}</p> : null}
        <button
          className='primary-button disabled:cursor-not-allowed disabled:opacity-60'
          type='submit'
          disabled={isSubmitting}
        >
          登录并继续
        </button>
      </form>
      <p className='text-sm text-[color:var(--text-soft)]'>
        还没有账号？
        <Link className='soft-link ml-2 font-medium text-[color:var(--text)]' href='/register'>
          去创建档案
        </Link>
      </p>
    </main>
  );
}
