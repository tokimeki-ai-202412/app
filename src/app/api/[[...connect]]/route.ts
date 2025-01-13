import { CreateRunpod, type RunpodClient } from '@/libraries/runpod';
import {
  contextKeyBucketName,
  contextKeyOriginUrl,
  contextKeyPrisma,
  contextKeyR2,
  contextKeyRunpod,
} from '@/server/context';
import { Router } from '@/server/router';
import { S3Client } from '@aws-sdk/client-s3';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { createContextValues } from '@connectrpc/connect';
import { PrismaClient } from '@prisma/client';
import type { NextRequest } from 'next/server';

import { connect } from "@tidbcloud/serverless";
import { PrismaTiDBCloud } from "@tidbcloud/prisma-adapter";

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const connection = connect({ url: getRequestContext().env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
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

function initRunpod(): RunpodClient {
  return CreateRunpod(getRequestContext().env.RUNPOD_API_TOKEN);
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
  contextValues.set(
    contextKeyOriginUrl,
    process.env.NODE_ENV === 'production'
      ? new URL(req.url).origin
      : 'https://develop.tokimeki-ai-app.pages.dev',
  );

  // handle request
  const router = new Router(contextValues);
  return router.handle(req);
}
