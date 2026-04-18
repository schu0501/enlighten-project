import React from 'react';
import Link from 'next/link';

export function TopNav() {
  return (
    <header className='border-b border-stone-200 bg-white/90 backdrop-blur'>
      <nav aria-label='Primary' className='mx-auto flex max-w-5xl items-center justify-between px-6 py-4'>
        <Link className='text-sm font-semibold tracking-[0.24em] text-stone-900' href='/'>
          PARENT-GUIDED
        </Link>
        <div className='flex items-center gap-6 text-sm text-stone-600'>
          <Link href='/today'>今日陪伴</Link>
          <Link href='/explore'>探索</Link>
          <Link href='/profile'>我的</Link>
        </div>
      </nav>
    </header>
  );
}
