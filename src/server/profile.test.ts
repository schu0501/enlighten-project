import { describe, expect, it, vi } from 'vitest';

vi.mock('../lib/auth', () => ({
  auth: vi.fn(),
  getPrimaryChildForEmail: vi.fn(),
}));

vi.mock('../lib/db-setup', () => ({
  ensureDatabase: vi.fn(),
}));

import { auth, getPrimaryChildForEmail } from '../lib/auth';
import { getPrimaryChildProfile } from './profile';

describe('getPrimaryChildProfile', () => {
  it('returns the current default child with stage guidance', async () => {
    vi.mocked(auth).mockResolvedValue({
      user: {
        email: 'parent@example.com',
      },
    } as never);
    vi.mocked(getPrimaryChildForEmail).mockResolvedValue({
      id: 'child-1',
      nickname: '小米',
      birthDate: new Date('2023-08-01'),
      isPrimary: true,
      user: {
        email: 'parent@example.com',
      },
    } as never);

    await expect(getPrimaryChildProfile()).resolves.toMatchObject({
      id: 'child-1',
      nickname: '小米',
      userEmail: 'parent@example.com',
      birthDateLabel: '2023-08-01',
      stage: {
        stageKey: 'toddler',
      },
    });
  });
});
