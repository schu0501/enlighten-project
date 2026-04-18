import type { ChildStageKey } from '../../lib/stage';
import { STAGE_LABELS, type Topic } from '../../lib/topics';

type TopicGridProps = {
  topics: Topic[];
  currentStageKey?: ChildStageKey | null;
};

export function TopicGrid({ topics, currentStageKey }: TopicGridProps) {
  return (
    <section className='grid gap-4'>
      <div className='grid gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>主题探索</p>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>可直接开始的亲子主题</h2>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {topics.map((topic) => {
          const isCurrentStageTopic = currentStageKey ? topic.stageKeys.includes(currentStageKey) : false;

          return (
            <article
              key={topic.id}
              className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm'
            >
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='text-xl font-semibold tracking-tight text-stone-900'>{topic.title}</h3>
                {isCurrentStageTopic ? (
                  <span className='rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900'>
                    当前适合
                  </span>
                ) : null}
              </div>
              <p className='text-sm leading-6 text-stone-700'>{topic.summary}</p>
              <div className='flex flex-wrap gap-2 text-xs font-medium text-stone-600'>
                {topic.stageKeys.map((stageKey) => (
                  <span key={stageKey} className='rounded-full bg-stone-100 px-3 py-1'>
                    {STAGE_LABELS[stageKey]}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
