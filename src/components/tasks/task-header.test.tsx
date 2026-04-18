// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TaskHeader } from './task-header';

describe('TaskHeader', () => {
  it('renders the duration label in Chinese', () => {
    render(
      <TaskHeader
        childLabel='小米 · 2岁8个月'
        task={{
          title: '听听摇篮曲',
          topic: '感官启蒙',
          description: '和孩子一起听一首轻柔的摇篮曲。',
          durationMinutes: 6,
        }}
      />,
    );

    expect(screen.getByText('6 分钟')).toBeInTheDocument();
  });
});
