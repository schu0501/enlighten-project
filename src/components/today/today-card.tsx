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
    <article className='surface-panel grid gap-6 p-7 sm:p-8'>
      <div className='flex flex-wrap items-center gap-3 text-sm'>
        <span className='soft-tag soft-tag--accent'>{childLabel}</span>
        <span className='soft-tag'>{task.topic}</span>
        <span className='soft-tag'>{task.durationMinutes} 分钟</span>
      </div>
      <div className='grid gap-3'>
        <h2 className='section-title'>{task.title}</h2>
        <p className='section-copy text-base'>{task.description}</p>
      </div>
      <div className='flex flex-wrap items-center gap-4'>
        <Link className='primary-button' href={task.href}>
          {START_LABEL}
        </Link>
        <p className='max-w-xl text-sm leading-7 text-[color:var(--text-faint)]'>{COMPLETION_NOTE}</p>
      </div>
    </article>
  );
}
