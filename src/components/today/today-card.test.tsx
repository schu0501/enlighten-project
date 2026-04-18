// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { TodayCard } from './today-card';

function textFromCodes(...codes: number[]) {
  return String.fromCodePoint(...codes);
}

describe('TodayCard', () => {
  it('renders the child label, task details, and start link', () => {
    const childLabel = `${textFromCodes(0x5c0f, 0x7c73)} \u00b7 ${textFromCodes(0x0032, 0x5c81, 0x0038, 0x4e2a, 0x6708)}`;

    render(
      <TodayCard
        childLabel={childLabel}
        task={{
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
        }}
      />,
    );

    expect(screen.getByText(childLabel)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: textFromCodes(0x4e00, 0x7eed, 0x4e00, 0x53e5, 0x7684, 0x5c0f, 0x6545, 0x4e8b) })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: textFromCodes(0x600e, 0x4e48, 0x5f00, 0x59cb) })).toHaveAttribute(
      'href',
      '/tasks/toddler-story-bite',
    );
  });
});
