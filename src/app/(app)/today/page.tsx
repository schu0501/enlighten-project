import Link from 'next/link';

import { AppShell } from '../../../components/layout/app-shell';
import { BackupTaskList } from '../../../components/today/backup-task-list';
import { TodayCard } from '../../../components/today/today-card';
import { getTodayPageData } from '../../../server/tasks';

const TODAY_TITLE = String.fromCodePoint(0x4eca, 0x65e5, 0x966a, 0x4f34);
const TODAY_EMPTY_NOTE = String.fromCodePoint(
  0x5148,
  0x5efa,
  0x7acb,
  0x5b69,
  0x5b50,
  0x6863,
  0x6848,
  0xff0c,
  0x518d,
  0x7ed9,
  0x4f60,
  0x4e00,
  0x4e2a,
  0x8f7b,
  0x91cf,
  0x3001,
  0x53ef,
  0x5b8c,
  0x6210,
  0x7684,
  0x4eca,
  0x65e5,
  0x4efb,
  0x52a1,
  0x3002,
);
const TODAY_EMPTY_CTA = String.fromCodePoint(0x53bb, 0x521b, 0x5efa, 0x6863, 0x6848);
const TODAY_LEAD = String.fromCodePoint(0x8f7b, 0x4e00, 0x70b9, 0x3001, 0x77ed, 0x4e00, 0x70b9, 0x3001, 0x73b0, 0x5728, 0x5c31, 0x80fd, 0x5f00, 0x59cb, 0x3002);
const CHILD_RECORD_LINK = String.fromCodePoint(0x53bb, 0x770b, 0x770b, 0x5b69, 0x5b50, 0x6863, 0x6848);

export default async function TodayPage() {
  const data = await getTodayPageData();

  if (!data) {
    return (
      <AppShell>
        <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
          <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>Parent-guided enlightenment</p>
          <h1 className='text-4xl font-bold tracking-tight text-stone-900'>{TODAY_TITLE}</h1>
          <p className='max-w-2xl text-lg leading-8 text-stone-700'>{TODAY_EMPTY_NOTE}</p>
          <Link className='w-fit rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white' href='/register'>
            {TODAY_EMPTY_CTA}
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className='grid gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>Parent-guided enlightenment</p>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>{TODAY_TITLE}</h1>
        <p className='max-w-2xl text-lg leading-8 text-stone-700'>{TODAY_LEAD}</p>
      </section>
      <p className='text-sm font-medium text-stone-500'>{data.childLabel}</p>
      <TodayCard childLabel={data.childLabel} task={data.primaryTask} />
      <BackupTaskList tasks={data.backupTasks} />
      <p>
        <Link className='text-sm font-medium text-stone-600 underline underline-offset-4' href='/profile'>
          {CHILD_RECORD_LINK}
        </Link>
      </p>
    </AppShell>
  );
}
