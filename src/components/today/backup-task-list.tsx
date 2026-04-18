import Link from 'next/link';
import React from 'react';

type BackupTask = {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  href: string;
};

type BackupTaskListProps = {
  tasks: BackupTask[];
};

const BACKUP_LABEL = String.fromCodePoint(0x5982, 0x679c, 0x4eca, 0x5929, 0x4e0d, 0x5408, 0x9002);

export function BackupTaskList({ tasks }: BackupTaskListProps) {
  if (!tasks.length) {
    return null;
  }

  return (
    <section className='grid gap-4'>
      <h2 className='text-xl font-semibold tracking-tight text-stone-900'>{BACKUP_LABEL}</h2>
      <div className='grid gap-3'>
        {tasks.map((task) => (
          <Link
            key={task.id}
            className='grid gap-2 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 hover:shadow'
            href={task.href}
          >
            <div className='flex flex-wrap items-center gap-3'>
              <h3 className='text-lg font-semibold tracking-tight text-stone-900'>{task.title}</h3>
              <span className='rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-600'>{task.durationMinutes} 分钟</span>
            </div>
            <p className='text-sm leading-6 text-stone-600'>{task.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
