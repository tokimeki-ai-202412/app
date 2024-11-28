import type { CreateRunpodType } from '@/libraries/runpod';
import type { S3Client } from '@aws-sdk/client-s3';
import { createContextKey } from '@connectrpc/connect';
import type { PrismaClient } from '@prisma/client';

export const contextKeyPrisma = createContextKey<PrismaClient | undefined>(
  undefined,
);

export const contextKeyR2 = createContextKey<S3Client | undefined>(undefined);

export const contextKeyRunpod = createContextKey<CreateRunpodType | undefined>(
  undefined,
);

export const contextKeyUserId = createContextKey<string | undefined>(undefined);

export const contextKeyBucketName = createContextKey<string | undefined>(
  undefined,
);
