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
  it('generates a local build secret when no shared environment is detected', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.stubEnv('CI', '');
    vi.stubEnv('VERCEL', '');
    vi.stubEnv('VERCEL_ENV', '');

    const secret = resolveNextAuthSecret();

    expect(secret).toHaveLength(64);
    expect(secret).not.toBe('');
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
