import type { StageSummary as StageSummaryData } from '../../lib/stage';

type StageSummaryProps = {
  stage: StageSummaryData;
  childLabel: string;
};

export function StageSummary({ stage, childLabel }: StageSummaryProps) {
  return (
    <section className='surface-panel grid gap-4 p-7 sm:p-8'>
      <div className='grid gap-2'>
        <p className='page-kicker'>当前阶段建议</p>
        <h2 className='section-title'>{stage.stageLabel}</h2>
        <p className='text-sm text-[color:var(--text-faint)]'>{childLabel}</p>
        <p className='text-sm text-[color:var(--text-faint)]'>
          适合 {stage.ageRangeMonths[0]}-{stage.ageRangeMonths[1]} 个月
        </p>
      </div>
      <p className='section-copy text-base'>{stage.summary}</p>
      <div className='flex flex-wrap gap-2'>
        {stage.focusAreas.map((area) => (
          <span key={area} className='soft-tag'>
            {area}
          </span>
        ))}
      </div>
    </section>
  );
}
