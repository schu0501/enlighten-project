// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

vi.mock('../../../server/profile', () => ({
  getPrimaryChildProfile: vi.fn(),
}));

import ProfilePage from './page';
import { getPrimaryChildProfile } from '../../../server/profile';

describe('ProfilePage', () => {
  afterEach(() => {
    cleanup();
  });

  it('shows the current default child profile view', async () => {
    vi.mocked(getPrimaryChildProfile).mockResolvedValue({
      id: 'child-1',
      nickname: '小米',
      gender: 'girl',
      genderLabel: '女孩',
      birthDate: new Date('2023-08-01'),
      ageLabel: '2岁8个月',
      birthDateLabel: '2023-08-01',
      userEmail: 'parent@example.com',
      interestTags: ['动物', '故事'],
      developmentSignalTags: ['开始说短句'],
      stage: {
        stageKey: 'toddler',
        stageLabel: '幼儿启蒙期',
        ageRangeMonths: [12, 35],
        focusAreas: ['词汇表达', '模仿游戏', '分类认知'],
        summary: '围绕语言、模仿和基础分类能力，安排短时、可完成的亲子任务。',
      },
    });

    render(await ProfilePage());

    expect(screen.getByRole('heading', { name: '我的档案' })).toBeInTheDocument();
    expect(screen.getByText('当前阶段画像')).toBeInTheDocument();
    expect(screen.getByText('小米')).toBeInTheDocument();
    expect(screen.getByText('2023-08-01')).toBeInTheDocument();
    expect(screen.getByText('2岁8个月 · 幼儿启蒙期')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '编辑资料' })).toBeInTheDocument();
    expect(screen.getByLabelText('女孩')).toBeInTheDocument();
    expect(screen.getByText('动物')).toBeInTheDocument();
    expect(screen.getByText('故事')).toBeInTheDocument();
    expect(screen.getByText('开始说短句')).toBeInTheDocument();
    expect(screen.queryByText('让推荐更贴近孩子的当下状态')).not.toBeInTheDocument();
    expect(screen.getAllByText('词汇表达').length).toBeGreaterThan(0);
    expect(screen.getAllByText('模仿游戏').length).toBeGreaterThan(0);
    expect(screen.getAllByText('分类认知').length).toBeGreaterThan(0);
    expect(screen.getByText('这个阶段不需要学很多，每天一点点就够了。')).toBeInTheDocument();
  });

  it('keeps the full preference section visible when no tags are selected yet', async () => {
    vi.mocked(getPrimaryChildProfile).mockResolvedValue({
      id: 'child-1',
      nickname: '小米',
      gender: 'boy',
      genderLabel: '男孩',
      birthDate: new Date('2023-08-01'),
      ageLabel: '2岁8个月',
      birthDateLabel: '2023-08-01',
      userEmail: 'parent@example.com',
      interestTags: [],
      developmentSignalTags: [],
      stage: {
        stageKey: 'toddler',
        stageLabel: '幼儿启蒙期',
        ageRangeMonths: [12, 35],
        focusAreas: ['词汇表达', '模仿游戏', '分类认知'],
        summary: '围绕语言、模仿和基础分类能力，安排短时、可完成的亲子任务。',
      },
    });

    render(await ProfilePage());

    expect(screen.getByText('让推荐更贴近孩子的当下状态')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '编辑标签' })).not.toBeInTheDocument();
  });
});
