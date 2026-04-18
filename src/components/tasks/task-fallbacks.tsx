import React from 'react';

type TaskFallback = {
  title: string;
  description: string;
};

type TaskFallbacksProps = {
  fallbacks: TaskFallback[];
};

export function TaskFallbacks({ fallbacks }: TaskFallbacksProps) {
  return (
    <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <div className='grid gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>如果孩子今天状态不一样</p>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>把任务调轻一点也算完成</h2>
      </div>
      <div className='grid gap-3'>
        {fallbacks.map((fallback) => (
          <article key={fallback.title} className='rounded-2xl bg-stone-50 p-4'>
            <h3 className='text-base font-semibold tracking-tight text-stone-900'>{fallback.title}</h3>
            <p className='mt-2 text-sm leading-6 text-stone-600'>{fallback.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
