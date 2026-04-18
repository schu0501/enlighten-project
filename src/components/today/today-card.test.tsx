import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import MarketingPage from '@/app/(marketing)/page';

describe('MarketingPage', () => {
  it('shows the parent-first value proposition and primary CTA', () => {
    render(<MarketingPage />);

    expect(screen.getByText('今天陪孩子做什么')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '开始建立孩子档案' })).toHaveAttribute(
      'href',
      '/register',
    );
  });
});
