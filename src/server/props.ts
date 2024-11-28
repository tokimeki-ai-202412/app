import type { CreateRunpodType } from '@/libraries/runpod';
import {
  contextKeyBucketName,
  contextKeyPrisma,
  contextKeyR2,
  contextKeyRunpod,
  contextKeyUserId,
} from '@/server/context.ts';
import { GetObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';
import type { PrismaClient } from '@prisma/client';

type Props = {
  userId: string | null;
  bucketName: string;
  prisma: PrismaClient;
  r2: S3Client;
  runpod: CreateRunpodType;
  generateDownloadUrl: (r2: S3Client, path: string) => Promise<string>;
};

export function GetProps(ctx: HandlerContext): Props {
  const userId = ctx.values.get(contextKeyUserId) || null;
  const bucketName = ctx.values.get(contextKeyBucketName);
  if (!bucketName) {
    throw new ConnectError('Internal Error', Code.Internal);
  }
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

  async function generateDownloadUrl(
    r2: S3Client,
    path: string,
  ): Promise<string> {
    return await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: bucketName,
        Key: path,
      }),
      { expiresIn: 3600 * 24 },
    );
  }

  return {
    userId,
    bucketName,
    prisma,
    r2,
    runpod,
    generateDownloadUrl,
  };
}
