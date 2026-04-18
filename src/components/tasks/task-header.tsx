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
    <header className='surface-panel grid gap-5 p-7 sm:p-9'>
      <div className='flex flex-wrap items-center gap-3 text-sm'>
        <span className='soft-tag soft-tag--accent'>{childLabel}</span>
        <span className='soft-tag'>{task.topic}</span>
        <span className='soft-tag'>{task.durationMinutes} 分钟</span>
      </div>
      <div className='grid gap-3'>
        <h1 className='page-title text-[clamp(2.3rem,4.2vw,3.7rem)]'>{task.title}</h1>
        <p className='page-lead max-w-3xl'>{task.description}</p>
      </div>
    </header>
  );
}
