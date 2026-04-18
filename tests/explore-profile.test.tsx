// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/server/profile', () => ({
  getPrimaryChildProfile: vi.fn(),
}));

import ExplorePage from '../src/app/(app)/explore/page';
import ProfilePage from '../src/app/(app)/profile/page';
import { getPrimaryChildProfile } from '../src/server/profile';

const profileFixture = {
  id: 'child-1',
  nickname: '小米',
  birthDate: new Date('2023-08-01'),
  ageLabel: '2岁8个月',
  birthDateLabel: '2023-08-01',
  userEmail: 'parent@example.com',
  stage: {
    stageKey: 'toddler' as const,
    stageLabel: '幼儿启蒙期',
    ageRangeMonths: [12, 35] as [number, number],
    focusAreas: ['词汇表达', '模仿游戏', '分类认知'],
    summary: '围绕语言、模仿和基础分类能力，安排短时、可完成的亲子任务。',
  },
};

afterEach(() => {
  cleanup();
});

describe('ExplorePage', () => {
  it('shows topics and current stage guidance', async () => {
    vi.mocked(getPrimaryChildProfile).mockResolvedValue(profileFixture);

    render(await ExplorePage());

    expect(screen.getByRole('heading', { name: '探索' })).toBeInTheDocument();
    expect(screen.getByText('当前阶段建议')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '幼儿启蒙期' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '动物' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '故事' })).toBeInTheDocument();
  });
});

describe('ProfilePage', () => {
  it('shows the current default child profile view', async () => {
    vi.mocked(getPrimaryChildProfile).mockResolvedValue(profileFixture);

    render(await ProfilePage());

    expect(screen.getByRole('heading', { name: '我的档案' })).toBeInTheDocument();
    expect(screen.getByText('当前默认孩子')).toBeInTheDocument();
    expect(screen.getByText('小米')).toBeInTheDocument();
    expect(screen.getByText('2023-08-01')).toBeInTheDocument();
    expect(screen.getByText('2岁8个月 · 幼儿启蒙期')).toBeInTheDocument();
  });
});
