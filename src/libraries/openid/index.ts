import { Authenticator } from '@/libraries/openid/authenticator';
import { ClientOptions, type Environment } from '@/libraries/openid/types';
export * from '@/libraries/openid/types';
export * from '@/libraries/openid/authenticator';
export * from '@/libraries/openid/jwt';

export function buildAuthenticator(env: any): Authenticator {
  const options = {
    id: env.OIDC_CLIENT_ID,
    secret: env.OIDC_CLIENT_SECRET,
    redirectUri: env.OIDC_CLIENT_REDIRECT_URI,
    authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenEndpoint: 'https://oauth2.googleapis.com/token',
    keysEndpoint: 'https://www.googleapis.com/oauth2/v3/certs',
    discoveryCacheTTL: 3600,
  };

  return new Authenticator(env.OIDC_ISSUER, options);
}

export function extractAuthReturn(request: { url: string | URL }): string[] {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';

  return [code, state];
}
