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
      <section className='page-hero'>
        <p className='page-kicker'>Parent-guided enlightenment</p>
        <h1 className='page-title text-[clamp(2.4rem,4.6vw,3.8rem)]'>探索</h1>
        <p className='page-lead'>
          先看当前阶段，再挑一个轻量主题。我们尽量把探索压缩成父母能直接开始的短任务。
        </p>
      </section>

      {profile ? (
        <div className='grid gap-6'>
          <StageSummary stage={profile.stage} childLabel={`${profile.nickname} · ${profile.ageLabel}`} />
          <TopicGrid topics={TOPICS} currentStageKey={profile.stage.stageKey} />
        </div>
      ) : (
        <section className='surface-panel grid gap-4 p-7 sm:p-8'>
          <h2 className='section-title'>先补一个孩子档案</h2>
          <p className='section-copy'>
            有了默认孩子之后，这里会自动展示更贴合年龄阶段的主题建议。
          </p>
          <Link className='primary-button w-fit' href='/register'>
            去创建档案
          </Link>
        </section>
      )}
    </AppShell>
  );
}
