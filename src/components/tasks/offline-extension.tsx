import React from 'react';

type OfflineExtensionProps = {
  description: string;
};

export function OfflineExtension({ description }: OfflineExtensionProps) {
  return (
    <section className='surface-soft grid gap-3 border-dashed p-6'>
      <p className='page-kicker text-[color:var(--text-faint)]'>离线延伸</p>
      <p className='text-base leading-8 text-[color:var(--text-soft)]'>{description}</p>
    </section>
  );
}
