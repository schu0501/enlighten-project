// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock('next-auth/react', () => ({
  signIn: vi.fn(async () => ({ ok: true })),
}));

import { ChildProfileForm } from './child-profile-form';

function chooseBirthDate(date = '2023-08-01') {
  fireEvent.click(screen.getByRole('button', { name: '请选择出生日期' }));
  fireEvent.change(screen.getByLabelText('出生年份'), { target: { value: '2023' } });
  fireEvent.change(screen.getByLabelText('出生月份'), { target: { value: '8' } });
  fireEvent.click(screen.getByRole('button', { name: date }));
}

describe('ChildProfileForm', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('shows a clear validation error for short passwords', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    render(<ChildProfileForm />);

    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: '869187331@qq.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '123456' } });
    fireEvent.change(screen.getByLabelText('孩子昵称'), { target: { value: '小酥' } });
    fireEvent.click(screen.getByRole('button', { name: '女孩' }));
    chooseBirthDate();

    fireEvent.submit(screen.getByRole('button', { name: '创建档案并开始' }).closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('密码至少需要 8 位。')).toBeInTheDocument();
    });

    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('submits a composed birth date from picker fields', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<ChildProfileForm />);

    fireEvent.change(screen.getByLabelText('邮箱'), { target: { value: '869187331@qq.com' } });
    fireEvent.change(screen.getByLabelText('密码'), { target: { value: '12345678' } });
    fireEvent.change(screen.getByLabelText('孩子昵称'), { target: { value: '小酥' } });
    fireEvent.click(screen.getByRole('button', { name: '女孩' }));
    chooseBirthDate();
    fireEvent.click(screen.getByRole('button', { name: '动物' }));
    fireEvent.click(screen.getByRole('button', { name: '故事' }));
    fireEvent.click(screen.getByRole('button', { name: '开始说短句' }));

    expect(screen.getByRole('button', { name: '2023-08-01' })).toBeInTheDocument();

    fireEvent.submit(screen.getByRole('button', { name: '创建档案并开始' }).closest('form')!);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    const request = fetchSpy.mock.calls[0];
    expect(request?.[0]).toBe('/api/register');
    expect(String(request?.[1]?.body)).toContain('"gender":"girl"');
    expect(String(request?.[1]?.body)).toContain('"birthDate":"2023-08-01"');
    expect(String(request?.[1]?.body)).toContain('"interestTags":["动物","故事"]');
    expect(String(request?.[1]?.body)).toContain('"developmentSignalTags":["开始说短句"]');
  });

  it('hides email and password fields for signed-in parents and submits only child profile data', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true, mode: 'profile' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    render(<ChildProfileForm signedIn />);

    expect(screen.queryByLabelText('邮箱')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('密码')).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('孩子昵称'), { target: { value: '小酥' } });
    fireEvent.click(screen.getByRole('button', { name: '男孩' }));
    chooseBirthDate();
    fireEvent.click(screen.getByRole('button', { name: '动物' }));

    fireEvent.submit(screen.getByRole('button', { name: '保存孩子档案' }).closest('form')!);

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    const request = fetchSpy.mock.calls[0];
    expect(String(request?.[1]?.body)).not.toContain('"email"');
    expect(String(request?.[1]?.body)).not.toContain('"password"');
    expect(String(request?.[1]?.body)).toContain('"nickname":"小酥"');
    expect(String(request?.[1]?.body)).toContain('"gender":"boy"');
    expect(String(request?.[1]?.body)).toContain('"interestTags":["动物"]');
  });
});
