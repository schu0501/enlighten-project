import React from 'react';

import { TopNav } from '@/components/layout/top-nav';

import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='zh-CN'>
      <body className='min-h-screen bg-stone-50 text-stone-900 antialiased'>
        <TopNav />
        {children}
      </body>
    </html>
  );
}
