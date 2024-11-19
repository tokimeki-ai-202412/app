import { buildAuthenticator } from '@/libraries/openid';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

export function GET(_: NextRequest) {
  const auth = buildAuthenticator(getRequestContext().env);

  // Save state to verify response
  const state = 'temporary';

  const url = auth.authorizeURL(state, [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
  ]);

  return redirect(url);
}
