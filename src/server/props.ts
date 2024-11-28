import type { CreateRunpodType } from '@/libraries/runpod';
import {
  contextKeyPrisma,
  contextKeyR2,
  contextKeyRunpod,
  contextKeyUserId,
} from '@/server/context.ts';
import type { S3Client } from '@aws-sdk/client-s3';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';
import type { PrismaClient } from '@prisma/client';

type Props = {
  userId: string | null;
  prisma: PrismaClient;
  r2: S3Client;
  runpod: CreateRunpodType;
};

export function GetProps(ctx: HandlerContext): Props {
  const userId = ctx.values.get(contextKeyUserId) || null;
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }
  const r2 = ctx.values.get(contextKeyR2);
  if (!r2) {
    throw new ConnectError('Internal Error', Code.Internal);
  }
  const runpod = ctx.values.get(contextKeyRunpod);
  if (!runpod) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  return {
    userId,
    prisma,
    r2,
    runpod,
  };
}
