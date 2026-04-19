// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: vi.fn(),
  }),
}));

import { ChildBirthDateEditor } from './child-birthdate-editor';

describe('ChildBirthDateEditor', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('opens only after clicking edit and submits the chosen birth date', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, birthDate: '2023-08-02' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(
      <ChildBirthDateEditor
        initialBirthDate='2023-08-01'
        initialGender='girl'
        initialInterestTags={['动物']}
        initialDevelopmentSignalTags={['开始说短句']}
        nickname='小米'
      />,
    );

    expect(screen.queryByRole('dialog', { name: '编辑孩子资料' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '编辑资料' }));

    const dialog = screen.getByRole('dialog', { name: '编辑孩子资料' });
    expect(dialog).toBeInTheDocument();
    expect(dialog.className).toContain('max-h-[calc(100dvh-2rem)]');
    expect(dialog.className).toContain('overflow-y-auto');
    fireEvent.click(screen.getByRole('button', { name: '2023-08-01' }));
    fireEvent.click(screen.getByRole('button', { name: '2023-08-02' }));
    fireEvent.click(screen.getByRole('button', { name: '男孩' }));
    fireEvent.click(screen.getByRole('button', { name: '保存资料' }));

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    expect(String(fetchSpy.mock.calls[0]?.[1]?.body)).toContain('"birthDate":"2023-08-02"');
    expect(String(fetchSpy.mock.calls[0]?.[1]?.body)).toContain('"gender":"boy"');
    expect(String(fetchSpy.mock.calls[0]?.[1]?.body)).toContain('"interestTags":["动物"]');
  });
});
