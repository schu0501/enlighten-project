import Link from 'next/link';

import { AppShell } from '../../../components/layout/app-shell';
import { StageSummary } from '../../../components/explore/stage-summary';
import { TopicGrid } from '../../../components/explore/topic-grid';
import { TOPICS } from '../../../lib/topics';
import { getPrimaryChildProfile } from '../../../server/profile';

export default async function ExplorePage() {
  const profile = await getPrimaryChildProfile();

  return (
    <AppShell>
      <section className='grid gap-3'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>Parent-guided enlightenment</p>
        <h1 className='text-4xl font-bold tracking-tight text-stone-900'>探索</h1>
        <p className='max-w-2xl text-lg leading-8 text-stone-700'>
          先看当前阶段，再挑一个轻量主题。我们尽量把探索压缩成父母能直接开始的短任务。
        </p>
      </section>

      {profile ? (
        <div className='grid gap-6'>
          <StageSummary stage={profile.stage} childLabel={`${profile.nickname} · ${profile.ageLabel}`} />
          <TopicGrid topics={TOPICS} currentStageKey={profile.stage.stageKey} />
        </div>
      ) : (
        <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
          <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>先补一个孩子档案</h2>
          <p className='text-stone-700'>
            有了默认孩子之后，这里会自动展示更贴合年龄阶段的主题建议。
          </p>
          <Link className='w-fit rounded-full bg-stone-900 px-5 py-3 text-sm font-semibold text-white' href='/register'>
            去创建档案
          </Link>
        </section>
      )}
    </AppShell>
  );
}
