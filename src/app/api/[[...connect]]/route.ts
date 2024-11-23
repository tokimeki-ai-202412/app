import { contextKeyPrisma, contextKeyR2 } from '@/server/context';
import { Router } from '@/server/router';
import { S3Client } from '@aws-sdk/client-s3';
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

function initR2(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: `https://b85aec95c2061893225e07d0d9ba7137.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getRequestContext().env.R2_ACCESS_KEY_ID,
      secretAccessKey: getRequestContext().env.R2_SECRET_ACCESS_KEY,
    },
  });
}

export function POST(req: NextRequest) {
  const prisma = initPrismaClient();
  const r2 = initR2();

  // Create context values
  const contextValues = createContextValues();
  contextValues.set(contextKeyPrisma, prisma);
  contextValues.set(contextKeyR2, r2);

  // handle request
  const router = new Router(contextValues);
  return router.handle(req);
}
