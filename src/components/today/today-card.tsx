import Link from 'next/link';
import React from 'react';

type TodayTask = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  topic: string;
  href: string;
};

type TodayCardProps = {
  childLabel: string;
  task: TodayTask;
};

const START_LABEL = String.fromCodePoint(0x600e, 0x4e48, 0x5f00, 0x59cb);
const COMPLETION_NOTE = String.fromCodePoint(
  0x5148,
  0x505a,
  0x4e00,
  0x4e2a,
  0x5f88,
  0x5c0f,
  0x7684,
  0x7248,
  0x672c,
  0xff0c,
  0x5c31,
  0x5df2,
  0x7ecf,
  0x7b97,
  0x5b8c,
  0x6210,
  0x3002,
);

export function TodayCard({ childLabel, task }: TodayCardProps) {
  return (
    <article className='grid gap-5 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <div className='flex flex-wrap items-center gap-3 text-sm text-stone-500'>
        <span className='rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-900'>{childLabel}</span>
        <span className='rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600'>{task.topic}</span>
        <span className='rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600'>{task.durationMinutes} 分钟</span>
      </div>
      <div className='grid gap-3'>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>{task.title}</h2>
        <p className='text-base leading-7 text-stone-700'>{task.description}</p>
      </div>
      <div className='flex flex-wrap items-center gap-4'>
        <Link className='rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-stone-800' href={task.href}>
          {START_LABEL}
        </Link>
        <p className='text-sm leading-6 text-stone-500'>{COMPLETION_NOTE}</p>
      </div>
    </article>
  );
}
