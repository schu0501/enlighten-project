import { notFound } from 'next/navigation';

import { AIActionPanel } from '../../../../components/ai/ai-action-panel';
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
      <AIActionPanel childNickname={data.childNickname} task={data.task} />
    </AppShell>
  );
}

