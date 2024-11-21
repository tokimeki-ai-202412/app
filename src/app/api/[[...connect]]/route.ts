import { contextKeyPrisma } from '@/server/context';
import { Router } from '@/server/router';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createContextValues } from '@connectrpc/connect';
import { PrismaClient } from '@prisma/client';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import { connect } from '@tidbcloud/serverless';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const connection = connect({
    url: getRequestContext().env.DATABASE_URL,
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

export function POST(req: NextRequest) {
  const prisma = initPrismaClient();

  // Create context values
  const contextValues = createContextValues().set(contextKeyPrisma, prisma);

  // handle request
  const router = new Router(contextValues);
  return router.handle(req);
}
