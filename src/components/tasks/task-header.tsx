import React from 'react';

type TaskHeaderProps = {
  childLabel: string;
  task: {
    title: string;
    topic: string;
    description: string;
    durationMinutes: number;
  };
};

export function TaskHeader({ childLabel, task }: TaskHeaderProps) {
  return (
    <header className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <div className='flex flex-wrap items-center gap-3 text-sm'>
        <span className='rounded-full bg-amber-50 px-3 py-1 font-medium text-amber-900'>{childLabel}</span>
        <span className='rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600'>{task.topic}</span>
        <span className='rounded-full bg-stone-100 px-3 py-1 font-medium text-stone-600'>{task.durationMinutes} \u5206\u949f</span>
      </div>
      <div className='grid gap-3'>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>{task.title}</h1>
        <p className='max-w-3xl text-lg leading-8 text-stone-700'>{task.description}</p>
      </div>
    </header>
  );
}
