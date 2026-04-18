import crypto from 'node:crypto';

import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveNextAuthSecret } from './nextauth-secret';

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('resolveNextAuthSecret', () => {
  it('generates a stable local build secret when no shared environment is detected', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('CI', '');
    vi.stubEnv('VERCEL', '');
    vi.stubEnv('VERCEL_ENV', '');
    vi.stubEnv('DATABASE_URL', 'file:./prisma/dev.db');

    const firstSecret = resolveNextAuthSecret();
    delete globalThis.__nextAuthDevSecret;
    const secondSecret = resolveNextAuthSecret();

    expect(firstSecret).toHaveLength(64);
    expect(firstSecret).not.toBe('');
    expect(firstSecret).toBe(secondSecret);
  });

  it('fails closed in a shared production environment without a configured secret', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('CI', 'true');
    vi.stubEnv('NEXTAUTH_SECRET', '');

    expect(() => resolveNextAuthSecret()).toThrow('NEXTAUTH_SECRET must be set outside local development and test environments.');
  });

  it('returns the configured secret when present', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('NEXTAUTH_SECRET', 'configured-secret');

    expect(resolveNextAuthSecret()).toBe('configured-secret');
  });
});
