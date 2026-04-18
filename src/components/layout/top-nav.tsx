import React from 'react';
import Link from 'next/link';
import { readSessionSafely } from '@/lib/auth';

export async function TopNav() {
  const session = await readSessionSafely();
  const isSignedIn = Boolean(session?.user?.email);

  return (
    <header className='sticky top-0 z-20 border-b border-[color:var(--line)] bg-[rgba(248,243,235,0.82)] backdrop-blur-xl'>
      <nav aria-label='Primary' className='mx-auto flex w-[min(1120px,calc(100vw-2rem))] flex-wrap items-center justify-between gap-3 py-4'>
        <Link className='grid gap-1' href='/'>
          <span className='brand-eyebrow'>Parent-guided enlightenment</span>
          <span className='brand-mark text-xl text-[color:var(--text)]'>晨伴启蒙</span>
        </Link>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[rgba(255,251,245,0.72)] p-1.5 text-sm text-[color:var(--text-soft)] shadow-[0_12px_28px_-24px_rgba(84,63,43,0.45)]'>
            <Link className='rounded-full px-4 py-2 transition hover:bg-white/80 hover:text-[color:var(--text)]' href='/today'>
              今日陪伴
            </Link>
            <Link className='rounded-full px-4 py-2 transition hover:bg-white/80 hover:text-[color:var(--text)]' href='/explore'>
              探索
            </Link>
            <Link className='rounded-full px-4 py-2 transition hover:bg-white/80 hover:text-[color:var(--text)]' href='/profile'>
              我的
            </Link>
          </div>
          {isSignedIn ? null : (
            <Link className='secondary-button px-4 py-2 text-sm' href='/login'>
              登录
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
