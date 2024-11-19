import {
  type JWT,
  buildAuthenticator,
  extractAuthReturn,
} from '@/libraries/openid';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { PrismaClient } from '@prisma/client';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import { connect } from '@tidbcloud/serverless';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const connection = connect({
    url: getRequestContext().env.DATABASE_URL,
    // biome-ignore
    fetch: (url, init) => {
      if (init) {
        // biome-ignore lint/performance/noDelete: <explanation>
        delete init['cache'];
      }
      return fetch(url, init);
    },
  });
  const adapter = new PrismaTiDBCloud(connection);
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
        },
      });
    }

    // update user data
    const user = await prisma.user.findFirstOrThrow({
      where: {
        googleId,
      },
      select: {
        id: true,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 200,
    });
  } catch (e: any) {
    console.log(e);
    return new Response(null, { status: 500 });
  }
}
