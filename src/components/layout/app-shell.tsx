import React from 'react';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return <main className='page-shell flex min-h-[calc(100vh-4.5rem)] flex-col gap-8'>{children}</main>;
}
