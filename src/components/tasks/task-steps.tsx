import React from 'react';

type TaskStepsProps = {
  steps: string[];
};

const SECTION_LABEL = String.fromCodePoint(0x600e, 0x4e48, 0x5f00, 0x59cb);

export function TaskSteps({ steps }: TaskStepsProps) {
  return (
    <section className='grid gap-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm'>
      <div className='grid gap-2'>
        <p className='text-sm font-semibold uppercase tracking-[0.28em] text-amber-700'>{SECTION_LABEL}</p>
        <h2 className='text-2xl font-semibold tracking-tight text-stone-900'>先把这件事拆成几个很小的动作</h2>
      </div>
      <ol className='grid gap-3'>
        {steps.map((step, index) => (
          <li key={step} className='grid gap-2 rounded-2xl bg-stone-50 p-4'>
            <span className='text-xs font-semibold uppercase tracking-[0.24em] text-stone-500'>Step {index + 1}</span>
            <p className='text-base leading-7 text-stone-700'>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
