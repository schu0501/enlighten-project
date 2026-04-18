import React from 'react';

type TaskStepsProps = {
  steps: string[];
};

const SECTION_LABEL = String.fromCodePoint(0x600e, 0x4e48, 0x5f00, 0x59cb);

export function TaskSteps({ steps }: TaskStepsProps) {
  return (
    <section className='surface-panel grid gap-5 p-7 sm:p-8'>
      <div className='grid gap-2'>
        <p className='page-kicker'>{SECTION_LABEL}</p>
        <h2 className='section-title'>先把这件事拆成几个很小的动作</h2>
      </div>
      <ol className='grid gap-3'>
        {steps.map((step, index) => (
          <li key={step} className='surface-inset grid gap-3 p-4'>
            <span className='text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-faint)]'>Step {index + 1}</span>
            <p className='text-base leading-8 text-[color:var(--text-soft)]'>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
