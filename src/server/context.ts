import { createContextKey } from '@connectrpc/connect';
import type { PrismaClient } from '@prisma/client';

export const contextKeyPrisma = createContextKey<PrismaClient | undefined>(
  undefined,
);

export const contextKeyUserId = createContextKey<string | undefined>(undefined);
