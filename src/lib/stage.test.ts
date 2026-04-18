import { describe, expect, it } from 'vitest';

import { getStageSummary } from './stage';

describe('stage summaries', () => {
  it('maps a toddler to the toddler stage summary', () => {
    expect(getStageSummary(new Date('2023-08-01'), new Date('2026-04-18'))).toMatchObject({
      stageKey: 'toddler',
      stageLabel: '幼儿启蒙期',
    });
  });
});
