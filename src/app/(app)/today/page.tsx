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
        <section className='surface-panel grid gap-4 p-7 sm:p-9'>
          <p className='page-kicker'>Parent-guided enlightenment</p>
          <h1 className='page-title text-[clamp(2.4rem,4.6vw,3.8rem)]'>{TODAY_TITLE}</h1>
          <p className='page-lead'>{TODAY_EMPTY_NOTE}</p>
          <Link className='primary-button w-fit' href='/register'>
            {TODAY_EMPTY_CTA}
          </Link>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className='page-hero'>
        <p className='page-kicker'>Parent-guided enlightenment</p>
        <h1 className='page-title text-[clamp(2.4rem,4.6vw,3.8rem)]'>{TODAY_TITLE}</h1>
        <p className='page-lead'>{TODAY_LEAD}</p>
      </section>
      <p className='text-sm font-medium tracking-[0.08em] text-[color:var(--text-faint)]'>{data.childLabel}</p>
      <TodayCard childLabel={data.childLabel} task={data.primaryTask} />
      <BackupTaskList tasks={data.backupTasks} />
      <p>
        <Link className='soft-link text-sm font-medium' href='/profile'>
          {CHILD_RECORD_LINK}
        </Link>
      </p>
    </AppShell>
  );
}
