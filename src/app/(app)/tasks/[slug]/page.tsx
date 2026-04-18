import { notFound } from 'next/navigation';

import { AppShell } from '../../../../components/layout/app-shell';
import { OfflineExtension } from '../../../../components/tasks/offline-extension';
import { TaskFallbacks } from '../../../../components/tasks/task-fallbacks';
import { TaskHeader } from '../../../../components/tasks/task-header';
import { TaskSteps } from '../../../../components/tasks/task-steps';
import { getTaskDetailData } from '../../../../server/tasks';

type TaskDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const PANEL_LABEL = String.fromCodePoint(0x0041, 0x0049, 0x20, 0x52a8, 0x4f5c, 0x9762, 0x677f);
const PANEL_TITLE = String.fromCodePoint(
  0x8ba9,
  0x20,
  0x0041,
  0x0049,
  0x20,
  0x5e2e,
  0x4f60,
  0x628a,
  0x4eca,
  0x5929,
  0x8fd9,
  0x4ef6,
  0x4e8b,
  0x53d8,
  0x8f7b,
  0x4e00,
  0x70b9,
);
const PANEL_NOTE = String.fromCodePoint(
  0x4f60,
  0x53ef,
  0x4ee5,
  0x76f4,
  0x63a5,
  0x8ba9,
  0x5b83,
  0x6539,
  0x6210,
  0x66f4,
  0x77ed,
  0x7684,
  0x7248,
  0x672c,
  0x3001,
  0x6362,
  0x4e00,
  0x53e5,
  0x5f00,
  0x573a,
  0x767d,
  0xff0c,
  0x6216,
  0x8005,
  0x5e2e,
  0x4f60,
  0x60f3,
  0x4e00,
  0x4e2a,
  0x5b69,
  0x5b50,
  0x4e0d,
  0x914d,
  0x5408,
  0x65f6,
  0x7684,
  0x6536,
  0x5c3e,
  0x3002,
);
const PANEL_ACTIONS = [String.fromCodePoint(0x6539, 0x6210, 0x20, 0x0035, 0x20, 0x5206, 0x949f, 0x7248), String.fromCodePoint(0x7ed9, 0x6211, 0x4e00, 0x53e5, 0x5f00, 0x573a, 0x767d), String.fromCodePoint(0x5b69, 0x5b50, 0x4e0d, 0x914d, 0x5408, 0x600e, 0x4e48, 0x529e)];

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { slug } = await params;
  const data = await getTaskDetailData(slug);

  if (!data) {
    notFound();
  }

  return (
    <AppShell>
      <TaskHeader childLabel={data.childLabel} task={data.task} />
      <TaskSteps steps={data.steps} />
      <TaskFallbacks fallbacks={data.fallbacks} />
      <OfflineExtension description={data.offlineExtension} />
      <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
        <div className='grid gap-2'>
          <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>{PANEL_LABEL}</p>
          <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>{PANEL_TITLE}</h2>
          <p className='text-sm leading-7 text-stone-600'>{PANEL_NOTE}</p>
        </div>
        <div className='flex flex-wrap gap-3'>
          {PANEL_ACTIONS.map((label) => (
            <button
              key={label}
              className='rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-900 hover:text-stone-900'
              type='button'
            >
              {label}
            </button>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
