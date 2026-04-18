// @vitest-environment jsdom
import '@testing-library/jest-dom/vitest';
import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth', () => ({
  readSessionSafely: vi.fn(),
}));

import MarketingPage from './page';
import { readSessionSafely } from '@/lib/auth';

describe('MarketingPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('shows the parent-first value proposition with register and login entry points for guests', async () => {
    vi.mocked(readSessionSafely).mockResolvedValue(null);

    render(await MarketingPage());

    expect(screen.getByText('今天陪孩子做什么')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '开始建立孩子档案' })).toHaveAttribute(
      'href',
      '/register',
    );
    expect(screen.getByRole('link', { name: '登录已有账号' })).toHaveAttribute('href', '/login');
  });

  it('hides the login entry point for signed-in parents', async () => {
    vi.mocked(readSessionSafely).mockResolvedValue({
      user: {
        email: 'parent@example.com',
      },
    } as never);

    render(await MarketingPage());

    expect(screen.queryByRole('link', { name: '登录已有账号' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '查看我的档案' })).toHaveAttribute('href', '/profile');
  });
});
