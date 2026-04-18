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
        <p className='page-kicker'>主题探索</p>
        <h2 className='section-title'>可直接开始的亲子主题</h2>
      </div>
      <div className='grid gap-4 md:grid-cols-2'>
        {topics.map((topic) => {
          const isCurrentStageTopic = currentStageKey ? topic.stageKeys.includes(currentStageKey) : false;

          return (
            <article
              key={topic.id}
              className='surface-soft grid gap-4 p-5 sm:p-6'
            >
              <div className='flex flex-wrap items-center gap-2'>
                <h3 className='text-xl font-semibold tracking-tight text-[color:var(--text)]'>{topic.title}</h3>
                {isCurrentStageTopic ? (
                  <span className='soft-tag soft-tag--accent text-xs'>
                    当前适合
                  </span>
                ) : null}
              </div>
              <p className='text-sm leading-7 text-[color:var(--text-soft)]'>{topic.summary}</p>
              <div className='flex flex-wrap gap-2 text-xs font-medium text-[color:var(--text-soft)]'>
                {topic.stageKeys.map((stageKey) => (
                  <span key={stageKey} className='soft-tag text-xs'>
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
