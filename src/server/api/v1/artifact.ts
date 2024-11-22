import type {
  CancelArtifactRequest,
  CancelArtifactResponse,
  CreateArtifactRequest,
  CreateArtifactResponse,
  DeleteArtifactRequest,
  DeleteArtifactResponse,
  GetArtifactRequest,
  GetArtifactResponse,
  ListArtifactsRequest,
  ListArtifactsResponse,
} from '@/libraries/connect-gen/api/v1/artifact/api_pb';
import type { Artifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { contextKeyPrisma, contextKeyUserId } from '@/server/context.ts';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const cancelArtifact: (
  req: CancelArtifactRequest,
  ctx: HandlerContext,
) => Promise<CancelArtifactResponse> = async () => {
  await wait(100);
  return {} as CancelArtifactResponse;
};

export const createArtifact: (
  req: CreateArtifactRequest,
  ctx: HandlerContext,
) => Promise<CreateArtifactResponse> = async () => {
  await wait(100);
  return {} as CreateArtifactResponse;
};

export const deleteArtifact: (
  req: DeleteArtifactRequest,
  ctx: HandlerContext,
) => Promise<DeleteArtifactResponse> = async () => {
  await wait(100);
  return {} as DeleteArtifactResponse;
};

export const getArtifact: (
  req: GetArtifactRequest,
  ctx: HandlerContext,
) => Promise<GetArtifactResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const artifact = await prisma.artifact.findFirstOrThrow({
    where: {
      id: req.artifactId,
      userId,
    },
  });

  // R2からartifact idのフォルダの中身をリストにしてすべてのファイルに署名する実装を追加する
  return {
    artifact: {
      id: artifact.id,
      jobId: artifact.jobId,
      status: artifact.status || 'ERROR',
    },
  } as GetArtifactResponse;
};

export const listArtifacts: (
  req: ListArtifactsRequest,
  ctx: HandlerContext,
) => Promise<ListArtifactsResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const artifacts = await prisma.artifact.findMany({
    where: {
      characterId: req.characterId,
      userId,
    },
  });

  // R2からartifact idのフォルダの中身をリストにしてすべてのファイルに署名する実装を追加する
  const results: Partial<Artifact>[] = artifacts.map((artifact) => ({
    id: artifact.id,
    jobId: artifact.jobId,
    status: artifact.status || 'ERROR',
    object_urls: [],
  }));

  return {
    artifacts: results,
  } as ListArtifactsResponse;
};
