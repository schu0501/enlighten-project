import React from 'react';

import type { PrimaryChildProfile } from '../../server/profile';

type ChildStageRadarCardProps = {
  profile: PrimaryChildProfile;
  action?: React.ReactNode;
  preferenceSummary?: React.ReactNode;
};

function buildFocusHint(focusArea: string) {
  if (focusArea.includes('词汇') || focusArea.includes('表达')) {
    return '今天更适合多说一点、慢一点，让孩子先听熟再跟着开口。';
  }

  if (focusArea.includes('模仿')) {
    return '用动作、表情和声音带着走，往往比直接讲道理更容易进入状态。';
  }

  if (focusArea.includes('分类') || focusArea.includes('认知')) {
    return '先从身边熟悉的物品开始，一次只放进一个很小的辨认任务。';
  }

  if (focusArea.includes('感官') || focusArea.includes('观察')) {
    return '让孩子先看、先听、先摸到，再慢慢补一句简单的话。';
  }

  if (focusArea.includes('情绪')) {
    return '先帮孩子说出感受，再进入活动，陪伴会更顺一些。';
  }

  if (focusArea.includes('规则') || focusArea.includes('习惯')) {
    return '把目标拆成一个动作来练，小步重复比一次讲很多更有用。';
  }

  return '先把节奏放轻一点，围绕这个方向做一个短而能完成的小任务就够了。';
}

export function ChildStageRadarCard({ profile, action, preferenceSummary }: ChildStageRadarCardProps) {
  const focusAreas = profile.stage.focusAreas.slice(0, 4);
  const interestTags = profile.interestTags.slice(0, 3);
  const developmentSignalTags = profile.developmentSignalTags.slice(0, 3);
  const genderIcon =
    profile.gender === 'girl' ? (
      <span
        className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(236,140,126,0.18)] text-[color:#c4645c]'
        aria-label='女孩'
        title='女孩'
      >
        <svg viewBox='0 0 20 20' className='h-4 w-4' fill='none' aria-hidden='true'>
          <circle cx='10' cy='7' r='3.5' stroke='currentColor' strokeWidth='1.6' />
          <path d='M10 10.8V17M7.2 14.1H12.8' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' />
        </svg>
      </span>
    ) : profile.gender === 'boy' ? (
      <span
        className='inline-flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(102,166,178,0.18)] text-[color:#4d8d98]'
        aria-label='男孩'
        title='男孩'
      >
        <svg viewBox='0 0 20 20' className='h-4 w-4' fill='none' aria-hidden='true'>
          <circle cx='8' cy='12' r='3.5' stroke='currentColor' strokeWidth='1.6' />
          <path d='M10.6 9.4L15 5M11.8 5H15V8.2' stroke='currentColor' strokeWidth='1.6' strokeLinecap='round' strokeLinejoin='round' />
        </svg>
      </span>
    ) : null;

  return (
    <section className='surface-panel overflow-hidden p-0'>
      <div className='grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr]'>
        <div className='grid gap-6'>
          <div className='overflow-hidden rounded-[1.9rem] border border-[color:var(--line)] bg-[radial-gradient(circle_at_center,rgba(255,252,247,0.98)_0%,rgba(245,236,224,0.9)_56%,rgba(235,225,212,0.95)_100%)]'>
            <div className='relative grid min-h-[30rem] grid-rows-[auto_1fr_auto] gap-6 px-6 py-7 sm:px-8'>
              <div className='absolute inset-6 rounded-[1.75rem] border border-dashed border-[rgba(126,99,73,0.1)]' />
              <div className='absolute inset-[19%] rounded-full border border-[rgba(126,99,73,0.08)]' />
              <div className='absolute inset-[31%] rounded-full border border-[rgba(126,99,73,0.07)]' />
              <div className='absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[rgba(126,99,73,0.05)]' />
              <div className='absolute top-1/2 left-6 h-px w-[calc(100%-3rem)] -translate-y-1/2 bg-[rgba(126,99,73,0.05)]' />

              <div className='relative z-10 grid gap-3 self-start'>
                <p className='page-kicker'>当前阶段画像</p>
                <div className='flex flex-wrap items-center gap-2'>
                  <h2 className='section-title'>{profile.nickname}</h2>
                  {genderIcon}
                </div>
                {interestTags.length > 0 || developmentSignalTags.length > 0 ? (
                  <div className='flex flex-wrap gap-3 text-sm text-[color:var(--text-soft)]'>
                    {interestTags.length > 0 ? (
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-faint)]'>兴趣</span>
                        {interestTags.map((tag) => (
                          <span key={tag} className='rounded-full bg-[rgba(255,248,240,0.92)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-soft)]'>
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {developmentSignalTags.length > 0 ? (
                      <div className='flex flex-wrap items-center gap-2'>
                        <span className='text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--text-faint)]'>特点</span>
                        {developmentSignalTags.map((tag) => (
                          <span
                            key={tag}
                            className='rounded-full border border-[rgba(126,99,73,0.12)] bg-[rgba(255,248,240,0.92)] px-2.5 py-1 text-xs font-medium text-[color:var(--text-soft)]'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}
                <p className='text-base text-[color:var(--text-soft)]'>{profile.ageLabel} · {profile.stage.stageLabel}</p>
              </div>

              <article className='relative z-10 mx-auto grid max-w-[14rem] place-self-center gap-3 rounded-[1.65rem] border border-[rgba(126,99,73,0.14)] bg-[rgba(255,251,245,0.9)] px-5 py-5 text-center shadow-[0_24px_48px_-36px_rgba(84,63,43,0.45)]'>
                <span className='soft-tag soft-tag--accent mx-auto'>今天的陪伴中心</span>
                <div className='grid gap-1'>
                  <h3 className='brand-mark text-2xl text-[color:var(--text)]'>{profile.stage.stageLabel}</h3>
                  <p className='text-sm leading-6 text-[color:var(--text-soft)]'>{profile.stage.summary}</p>
                </div>
              </article>

              <div className='relative z-10 grid gap-3 self-end rounded-[1.35rem] border border-[rgba(126,99,73,0.12)] bg-[rgba(255,250,243,0.82)] px-4 py-4 text-sm text-[color:var(--text-soft)] shadow-[0_18px_40px_-34px_rgba(84,63,43,0.38)] backdrop-blur-sm'>
                <div className='flex flex-wrap items-center gap-3'>
                  <span className='text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-faint)]'>出生日期</span>
                  <span>{profile.birthDateLabel}</span>
                  {action}
                </div>
                <div className='flex flex-wrap items-center gap-3'>
                  <span className='text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--text-faint)]'>适龄范围</span>
                  <span>
                    {profile.stage.ageRangeMonths[0]}-{profile.stage.ageRangeMonths[1]} 个月
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-4'>
          {focusAreas.map((focusArea, index) => (
            <article key={focusArea} className='surface-soft grid gap-2 p-4'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--text-faint)]'>
                {index === 0 ? '现在更适合先做' : index === 1 ? '陪伴时可以多给一点' : index === 2 ? '接下来慢慢带进去' : '今天也可以轻轻碰一下'}
              </p>
              <h3 className='text-lg font-semibold tracking-tight text-[color:var(--text)]'>{focusArea}</h3>
              <p className='text-sm leading-7 text-[color:var(--text-soft)]'>{buildFocusHint(focusArea)}</p>
            </article>
          ))}

          <dl className='surface-inset grid gap-4 p-5 text-sm text-[color:var(--text-soft)]'>
            <div className='grid gap-1 sm:grid-cols-[5.5rem_1fr] sm:items-start'>
              <dt className='font-medium text-[color:var(--text-faint)]'>家长账号</dt>
              <dd>{profile.userEmail}</dd>
            </div>
          </dl>

          {preferenceSummary}

          <p className='rounded-[1.4rem] bg-[rgba(255,250,242,0.9)] px-4 py-3 text-sm leading-7 text-[color:var(--text-soft)]'>
            这个阶段不需要学很多，每天一点点就够了。
          </p>
        </div>
      </div>
    </section>
  );
}
