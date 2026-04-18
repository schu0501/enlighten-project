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
    <section className='surface-panel grid gap-5 p-7 sm:p-8'>
      <div className='grid gap-2'>
        <p className='page-kicker'>如果孩子今天状态不一样</p>
        <h2 className='section-title'>把任务调轻一点也算完成</h2>
      </div>
      <div className='grid gap-3'>
        {fallbacks.map((fallback) => (
          <article key={fallback.title} className='surface-inset p-4'>
            <h3 className='text-base font-semibold tracking-tight text-[color:var(--text)]'>{fallback.title}</h3>
            <p className='mt-2 text-sm leading-7 text-[color:var(--text-soft)]'>{fallback.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
