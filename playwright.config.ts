import { defineConfig, devices } from '@playwright/test';

import { getStableDatabaseUrl } from './src/lib/database-url';

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    cwd: 'C:/develop/enlighten-project/.worktrees/codex/parent-guided-mvp',
    command: 'node tests/e2e/server.cjs',
    url: 'http://127.0.0.1:3000',
    reuseExistingServer: true,
    timeout: 120000,
    env: {
      DATABASE_URL: getStableDatabaseUrl(),
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
