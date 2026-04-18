import React from 'react';

type OfflineExtensionProps = {
  description: string;
};

export function OfflineExtension({ description }: OfflineExtensionProps) {
  return (
    <section className='grid gap-3 rounded-3xl border border-dashed border-stone-300 bg-stone-50 p-6'>
      <p className='text-sm font-semibold uppercase tracking-[0.28em] text-stone-600'>离线延伸</p>
      <p className='text-base leading-7 text-stone-700'>{description}</p>
    </section>
  );
}
