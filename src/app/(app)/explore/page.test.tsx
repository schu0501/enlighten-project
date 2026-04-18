// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../server/profile', () => ({
  getPrimaryChildProfile: vi.fn(),
}));

import ExplorePage from './page';
import { getPrimaryChildProfile } from '../../../server/profile';

describe('ExplorePage', () => {
  it('shows topics and current stage guidance', async () => {
    vi.mocked(getPrimaryChildProfile).mockResolvedValue({
      id: 'child-1',
      nickname: '小米',
      gender: 'girl',
      genderLabel: '女孩',
      birthDate: new Date('2023-08-01'),
      ageLabel: '2岁8个月',
      birthDateLabel: '2023-08-01',
      userEmail: 'parent@example.com',
      interestTags: ['动物'],
      developmentSignalTags: ['开始说短句'],
      stage: {
        stageKey: 'toddler',
        stageLabel: '幼儿启蒙期',
        ageRangeMonths: [12, 35],
        focusAreas: ['词汇表达', '模仿游戏', '分类认知'],
        summary: '围绕语言、模仿和基础分类能力，安排短时、可完成的亲子任务。',
      },
    });

    render(await ExplorePage());

    expect(screen.getByRole('heading', { name: '探索' })).toBeInTheDocument();
    expect(screen.getByText('当前阶段建议')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '幼儿启蒙期', level: 2 })).toBeInTheDocument();
    expect(screen.getByText('动物')).toBeInTheDocument();
    expect(screen.getByText('故事')).toBeInTheDocument();
  });
});
