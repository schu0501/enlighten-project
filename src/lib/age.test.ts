import { describe, expect, it } from 'vitest';

import { getAgeLabelInChinese } from './age';

describe('age labels', () => {
  it('formats toddler month labels', () => {
    expect(getAgeLabelInChinese(new Date('2023-08-01'), new Date('2026-04-18'))).toBe('2岁8个月');
  });
});
