import { CreateRunpod, type CreateRunpodType } from '@/libraries/runpod';
import {
  contextKeyBucketName,
  contextKeyPrisma,
  contextKeyR2,
  contextKeyRunpod,
} from '@/server/context';
import { Router } from '@/server/router';
import { S3Client } from '@aws-sdk/client-s3';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createContextValues } from '@connectrpc/connect';
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { PrismaClient } from '@prisma/client';
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

function initR2(): S3Client {
  return new S3Client({
    region: 'auto',
    endpoint: getRequestContext().env.R2_ENDPOINT,
    credentials: {
      accessKeyId: getRequestContext().env.R2_ACCESS_KEY_ID,
      secretAccessKey: getRequestContext().env.R2_SECRET_ACCESS_KEY,
    },
  });
}

function initRunpod(): CreateRunpodType {
  return CreateRunpod(
    getRequestContext().env.RUNPOD_API_TOKEN,
    getRequestContext().env.RUNPOD_ENDPOINT_HI3D_FIRST_MODEL_512,
  );
}

export function POST(req: NextRequest) {
  const prisma = initPrismaClient();
  const r2 = initR2();
  const runpod = initRunpod();
  const bucketName = getRequestContext().env.R2_BUCKET_NAME;

  // Create context values
  const contextValues = createContextValues();
  contextValues.set(contextKeyPrisma, prisma);
  contextValues.set(contextKeyR2, r2);
  contextValues.set(contextKeyRunpod, runpod);
  contextValues.set(contextKeyBucketName, bucketName);

  // handle request
  const router = new Router(contextValues);
  return router.handle(req);
}
