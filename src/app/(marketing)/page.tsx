import React from 'react';
import Link from 'next/link';
import { readSessionSafely } from '@/lib/auth';

export default async function MarketingPage() {
  const session = await readSessionSafely();
  const signedIn = Boolean(session?.user?.email);

  return (
    <main className='page-shell flex min-h-[calc(100vh-4.5rem)] flex-col justify-center gap-8'>
      <section className='surface-panel grid gap-7 px-6 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-14'>
        <p className='page-kicker'>Parent-guided enlightenment</p>
        <h1 className='page-title max-w-4xl'>今天陪孩子做什么</h1>
        <p className='page-lead max-w-3xl'>
          用分龄任务、真实世界延伸和 AI 辅助脚本，帮家长在短时间内完成高质量陪伴。
        </p>
        <div className='flex flex-wrap gap-4'>
          <Link className='primary-button text-[color:#fffdf9]' href='/register'>
            开始建立孩子档案
          </Link>
          {signedIn ? (
            <Link className='secondary-button' href='/profile'>
              查看我的档案
            </Link>
          ) : (
            <Link className='secondary-button' href='/login'>
              登录已有账号
            </Link>
          )}
          <Link className='soft-link flex items-center px-2 py-3 text-sm font-medium' href='/today'>
            先看看今日任务
          </Link>
        </div>
      </section>
      <section className='grid gap-4 text-sm leading-7 text-[color:var(--text-soft)] sm:grid-cols-3'>
        <div className='surface-soft p-5'>
          先看孩子现在所处的阶段，再给出一件今天就能开始的小任务。
        </div>
        <div className='surface-soft p-5'>
          每个任务都尽量短、轻、可完成，减少家长准备和判断成本。
        </div>
        <div className='surface-soft p-5'>
          AI 只做补充表达，不代替家长判断，也不把孩子长期留在屏幕前。
        </div>
      </section>
    </main>
  );
}
