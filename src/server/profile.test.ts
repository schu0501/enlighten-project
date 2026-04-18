import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/auth', () => ({
  readSessionSafely: vi.fn(),
  getPrimaryChildForEmail: vi.fn(),
  readChildPreferenceTags: vi.fn((child: { interestTags?: string; developmentSignalTags?: string }) => ({
    interestTags: child.interestTags ? JSON.parse(child.interestTags) : [],
    developmentSignalTags: child.developmentSignalTags ? JSON.parse(child.developmentSignalTags) : [],
  })),
}));

vi.mock('../lib/db-setup', () => ({
  ensureDatabase: vi.fn(),
}));

import { getPrimaryChildForEmail, readSessionSafely } from '../lib/auth';
import { getPrimaryChildProfile } from './profile';

describe('getPrimaryChildProfile', () => {
  it('returns the current default child with stage guidance', async () => {
    vi.mocked(readSessionSafely).mockResolvedValue({
      user: {
        email: 'parent@example.com',
      },
    } as never);
    vi.mocked(getPrimaryChildForEmail).mockResolvedValue({
      id: 'child-1',
      nickname: '小米',
      gender: 'girl',
      birthDate: new Date('2023-08-01'),
      isPrimary: true,
      interestTags: '["动物","故事"]',
      developmentSignalTags: '["开始说短句"]',
      user: {
        email: 'parent@example.com',
      },
    } as never);

    await expect(getPrimaryChildProfile()).resolves.toMatchObject({
      id: 'child-1',
      nickname: '小米',
      gender: 'girl',
      genderLabel: '女孩',
      userEmail: 'parent@example.com',
      birthDateLabel: '2023-08-01',
      interestTags: ['动物', '故事'],
      developmentSignalTags: ['开始说短句'],
      stage: {
        stageKey: 'toddler',
      },
    });
  });
});
