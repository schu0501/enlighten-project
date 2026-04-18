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
      <h2 className='section-title text-[clamp(1.5rem,3vw,1.9rem)]'>{BACKUP_LABEL}</h2>
      <div className='grid gap-3'>
        {tasks.map((task) => (
          <Link
            key={task.id}
            className='surface-soft grid gap-3 p-5 transition hover:-translate-y-0.5 hover:border-[color:var(--line-strong)]'
            href={task.href}
          >
            <div className='flex flex-wrap items-center gap-3'>
              <h3 className='text-lg font-semibold tracking-tight text-[color:var(--text)]'>{task.title}</h3>
              <span className='soft-tag text-xs'>{task.durationMinutes} 分钟</span>
            </div>
            <p className='text-sm leading-7 text-[color:var(--text-soft)]'>{task.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
