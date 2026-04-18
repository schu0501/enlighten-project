import React from 'react';
import Link from 'next/link';

export default function MarketingPage() {
  return (
    <main className={'mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-6 py-12'}>
      <p className={'text-sm font-semibold uppercase tracking-[0.3em] text-amber-700'}>
        Parent-guided enlightenment
      </p>
      <h1 className={'max-w-3xl text-5xl font-bold tracking-tight text-stone-900'}>
        今天陪孩子做什么
      </h1>
      <p className={'max-w-2xl text-lg leading-8 text-stone-700'}>
        用分龄任务、真实世界延伸和 AI 辅助脚本，帮家长在短时间内完成高质量陪伴。
      </p>
      <div className={'flex gap-4'}>
        <Link className={'rounded-full bg-stone-900 px-6 py-3 text-white'} href={'/register'}>
          开始建立孩子档案
        </Link>
        <Link className={'rounded-full border border-stone-300 px-6 py-3'} href={'/today'}>
          先看看今日任务
        </Link>
      </div>
    </main>
  );
}
