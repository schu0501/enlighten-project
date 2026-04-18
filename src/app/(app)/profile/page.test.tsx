// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../server/profile', () => ({
  getPrimaryChildProfile: vi.fn(),
}));

import ProfilePage from './page';
import { getPrimaryChildProfile } from '../../../server/profile';

describe('ProfilePage', () => {
  it('shows the current default child profile view', async () => {
    vi.mocked(getPrimaryChildProfile).mockResolvedValue({
      id: 'child-1',
      nickname: '小米',
      birthDate: new Date('2023-08-01'),
      ageLabel: '2岁8个月',
      birthDateLabel: '2023-08-01',
      userEmail: 'parent@example.com',
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
    expect(screen.getByText('当前默认孩子')).toBeInTheDocument();
    expect(screen.getByText('小米')).toBeInTheDocument();
    expect(screen.getByText('2023-08-01')).toBeInTheDocument();
    expect(screen.getByText('2岁8个月 · 幼儿启蒙期')).toBeInTheDocument();
  });
});
