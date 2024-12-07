import {
  type JWT,
  buildAuthenticator,
  extractAuthReturn,
} from '@/libraries/openid';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { PrismaClient } from '@prisma/client';
import { type SerializeOptions, serialize } from 'cookie';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const client = new Client({
    url: getRequestContext().env.DATABASE_URL,
    fetch: (url, init) => {
      if (init) {
        // biome-ignore lint/performance/noDelete: <explanation>
        delete init['cache'];
      }
      return fetch(url, init);
    },
  });
  const adapter = new PrismaPlanetScale(client);
  // @ts-ignore
  return new PrismaClient({ adapter });
}

export async function GET(req: NextRequest) {
  const auth = buildAuthenticator(getRequestContext().env);

  try {
    const [code, _] = extractAuthReturn(req);
    // User reject authorize application
    if (!code) {
      return new Response(null, { status: 401 });
    }

    // Exchange ID Token
    const token: JWT = await auth.exchange(code);
    const googleId: string = token.payload.sub;

    // init prisma
    const prisma = initPrismaClient();

    // create user if first login
    const count = await prisma.user.count({
      where: {
        googleId,
      },
    });
    if (count === 0) {
      await prisma.user.create({
        data: {
          googleId,
          jewelRemain: 3,
        },
      });
    }

    // get user data
    const user = await prisma.user.findFirstOrThrow({
      where: {
        googleId,
      },
      select: {
        id: true,
      },
    });

    // create session
    const session = await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    // Create cookie
    const url = new URL(req.url);
    const cookieOptions: SerializeOptions = {
      path: '/',
      domain: url.hostname,
      maxAge: 60 * 60 * 24 * 14,
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    };
    const cookieString = serialize('token', session.id, cookieOptions);

    // add headers
    const headers = new Headers();
    headers.append('Set-Cookie', cookieString);
    headers.append('Location', '/');

    return new Response(null, {
      headers,
      status: 307,
    });
  } catch (e: any) {
    console.log(e);
    return new Response(null, { status: 500 });
  }
}
