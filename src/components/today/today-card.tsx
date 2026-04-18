import React from 'react';

type TodayCardProps = {
  title: string;
  summary: string;
};

export function TodayCard({ title, summary }: TodayCardProps) {
  return (
    <article className='rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>{title}</h2>
      <p className='mt-3 text-base leading-7 text-stone-700'>{summary}</p>
    </article>
  );
}
