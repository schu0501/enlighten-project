// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TodayCard } from './today-card';

describe('TodayCard', () => {
  it('renders the title and summary', () => {
    render(<TodayCard title='今天陪孩子做什么' summary='先从一个 10 分钟的亲子任务开始。' />);

    expect(screen.getByRole('heading', { name: '今天陪孩子做什么' })).toBeInTheDocument();
    expect(screen.getByText('先从一个 10 分钟的亲子任务开始。')).toBeInTheDocument();
  });
});
