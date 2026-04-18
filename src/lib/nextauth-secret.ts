import crypto from 'node:crypto';

declare global {
  // eslint-disable-next-line no-var
  var __nextAuthDevSecret: string | undefined;
}

const sharedRuntimeIndicators = [
  'CI',
  'VERCEL',
  'VERCEL_ENV',
  'NETLIFY',
  'RENDER',
  'RAILWAY_PUBLIC_DOMAIN',
  'FLY_APP_NAME',
  'CF_PAGES',
  'GITHUB_ACTIONS',
];

function hasSharedRuntimeIndicator() {
  return sharedRuntimeIndicators.some((key) => {
    const value = process.env[key];
    return Boolean(value && value !== '0' && value !== 'false');
  });
}

function isLocalAuthSecretAllowed() {
  if (process.env.NEXTAUTH_ALLOW_MISSING_SECRET === '1') {
    return true;
  }

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    return true;
  }

  return !hasSharedRuntimeIndicator();
}

function createStableLocalSecret() {
  const seed = [
    'parent-guided-enlightenment',
    process.cwd(),
    process.env.DATABASE_URL?.trim() ?? '',
  ].join('::');

  return crypto.createHash('sha256').update(seed).digest('hex');
}

export function resolveNextAuthSecret() {
  const configuredSecret = process.env.NEXTAUTH_SECRET?.trim();

  if (configuredSecret) {
    return configuredSecret;
  }

  if (!isLocalAuthSecretAllowed()) {
    throw new Error('NEXTAUTH_SECRET must be set outside local development and test environments.');
  }

  globalThis.__nextAuthDevSecret ??= createStableLocalSecret();
  return globalThis.__nextAuthDevSecret;
}

