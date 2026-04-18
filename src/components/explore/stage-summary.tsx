import type { StageSummary as StageSummaryData } from '../../lib/stage';

type StageSummaryProps = {
  stage: StageSummaryData;
  childLabel: string;
};

export function StageSummary({ stage, childLabel }: StageSummaryProps) {
  return (
    <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <div className='grid gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>当前阶段建议</p>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>{stage.stageLabel}</h2>
        <p className='text-sm text-stone-500'>{childLabel}</p>
        <p className='text-sm text-stone-500'>
          适合 {stage.ageRangeMonths[0]}-{stage.ageRangeMonths[1]} 个月
        </p>
      </div>
      <p className='text-base leading-7 text-stone-700'>{stage.summary}</p>
      <div className='flex flex-wrap gap-2'>
        {stage.focusAreas.map((area) => (
          <span key={area} className='rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-700'>
            {area}
          </span>
        ))}
      </div>
    </section>
  );
}
