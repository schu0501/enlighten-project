import React from 'react';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return <main className='mx-auto flex min-h-[calc(100vh-4.5rem)] max-w-5xl flex-col gap-8 px-6 py-8'>{children}</main>;
}
