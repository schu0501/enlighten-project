import { describe, expect, it } from 'vitest';

import { getDailyRecommendation } from './recommendation';

describe('daily recommendation', () => {
  it('picks a parent task that matches stage and interests', () => {
    const task = getDailyRecommendation({
      birthDate: new Date('2023-08-01'),
      interests: ['故事'],
      developmentSignals: ['开始说短句'],
      now: new Date('2026-04-18'),
    });

    expect(task.topic).toBe('故事');
    expect(task.id).toBe('toddler-story-bite');
    expect(task.durationMinutes).toBeLessThanOrEqual(10);
  });
});
