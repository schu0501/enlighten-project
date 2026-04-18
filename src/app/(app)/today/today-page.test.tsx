// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('../../../server/tasks', () => ({
  getTodayPageData: vi.fn(),
}));

import TodayPage from './page';
import { getTodayPageData } from '../../../server/tasks';

function textFromCodes(...codes: number[]) {
  return String.fromCodePoint(...codes);
}

describe('TodayPage', () => {
  it('shows the parent-first daily task flow', async () => {
    const childLabel = `${textFromCodes(0x5c0f, 0x7c73)} \u00b7 ${textFromCodes(0x0032, 0x5c81, 0x0038, 0x4e2a, 0x6708)}`;

    vi.mocked(getTodayPageData).mockResolvedValue({
      childLabel,
      childNickname: textFromCodes(0x5c0f, 0x7c73),
      primaryTask: {
        id: 'toddler-story-bite',
        title: textFromCodes(0x4e00, 0x7eed, 0x4e00, 0x53e5, 0x7684, 0x5c0f, 0x6545, 0x4e8b),
        description: textFromCodes(
          0x5bb6,
          0x957f,
          0x5148,
          0x8bf4,
          0x4e00,
          0x53e5,
          0xff0c,
          0x5b69,
          0x5b50,
          0x8865,
          0x4e00,
          0x53e5,
          0xff0c,
          0x628a,
          0x719f,
          0x6089,
          0x89d2,
          0x8272,
          0x4e32,
          0x6210,
          0x4e00,
          0x4e2a,
          0x5c0f,
          0x6545,
          0x4e8b,
          0x3002,
        ),
        durationMinutes: 10,
        topic: textFromCodes(0x6545, 0x4e8b),
        href: '/tasks/toddler-story-bite',
      },
      backupTasks: [
        {
          id: 'toddler-transport-match',
          title: textFromCodes(0x4ea4, 0x901a, 0x5de5, 0x5177, 0x914d, 0x5bf9, 0x5c0f, 0x6e38, 0x620f),
          description: textFromCodes(
            0x627e,
            0x51fa,
            0x5bb6,
            0x91cc,
            0x6216,
            0x8def,
            0x4e0a,
            0x770b,
            0x5230,
            0x7684,
            0x4ea4,
            0x901a,
            0x5de5,
            0x5177,
            0xff0c,
            0x8bf4,
            0x51fa,
            0x5b83,
            0x4eec,
            0x4f1a,
            0x53bb,
            0x54ea,
            0x91cc,
            0x3002,
          ),
          durationMinutes: 10,
          topic: textFromCodes(0x4ea4, 0x901a, 0x5de5, 0x5177),
          href: '/tasks/toddler-transport-match',
        },
      ],
    });

    render(await TodayPage());

    expect(screen.getByText(textFromCodes(0x4eca, 0x65e5, 0x966a, 0x4f34))).toBeInTheDocument();
    expect(screen.getByText(textFromCodes(0x600e, 0x4e48, 0x5f00, 0x59cb))).toBeInTheDocument();
    expect(screen.getByText(textFromCodes(0x5982, 0x679c, 0x4eca, 0x5929, 0x4e0d, 0x5408, 0x9002))).toBeInTheDocument();
    expect(screen.getAllByText(childLabel)).toHaveLength(2);
  });
});
