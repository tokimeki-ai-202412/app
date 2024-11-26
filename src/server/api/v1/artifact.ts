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
import {
  contextKeyPrisma,
  contextKeyR2,
  contextKeyRunpod,
  contextKeyUserId,
} from '@/server/context.ts';
import {
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
  type S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';
import { ArtifactStatus } from '@prisma/client';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function createObjectUrls(
  r2: S3Client,
  artifact: any,
): Promise<string[]> {
  if (artifact.status !== ArtifactStatus.DONE) {
    return [];
  }

  const command = new ListObjectsV2Command({
    Bucket: 'tokimeki',
    Prefix: `artifacts/${artifact.id}/`, // フォルダパスを指定
    Delimiter: '/', // 必要に応じて階層構造を区切る
  });

  const response = await r2.send(command);
  if (response.Contents) {
    const results = response.Contents.map((item) => item.Key);
    const files = results.filter((item): item is string => item !== undefined);

    return await Promise.all(
      files.map(async (file) => {
        return await getSignedUrl(
          r2,
          new GetObjectCommand({
            Bucket: 'tokimeki',
            Key: file,
          }),
          { expiresIn: 3600 * 24 },
        );
      }),
    );
  }

  return [];
}

export const cancelArtifact: (
  req: CancelArtifactRequest,
  ctx: HandlerContext,
) => Promise<CancelArtifactResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }
  const runpod = ctx.values.get(contextKeyRunpod);
  if (!runpod) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  let artifact = await prisma.artifact.findFirstOrThrow({
    where: {
      id: req.artifactId,
    },
  });
  if (artifact.userId !== userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  if (
    artifact.status === ArtifactStatus.QUQUED ||
    artifact.status === ArtifactStatus.GENERATING
  ) {
    if (artifact.jobId) {
      await runpod.cancelJob(artifact.jobId);

      artifact = await prisma.artifact.update({
        where: {
          id: req.artifactId,
        },
        data: {
          status: ArtifactStatus.CANCELED,
        },
      });
    }
  }

  return {
    artifact: {
      id: artifact.id,
      status: artifact.status,
      objectUrls: [] as string[],
    },
  } as CancelArtifactResponse;
};

export const createArtifact: (
  req: CreateArtifactRequest,
  ctx: HandlerContext,
) => Promise<CreateArtifactResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
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

  if (!req.input) {
    throw new ConnectError('Invalid Argument', Code.InvalidArgument);
  }
  if (!req.input.imagePath.startsWith('temporary/')) {
    throw new ConnectError('Invalid Argument', Code.InvalidArgument);
  }

  // check temp file
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: 'tokimeki',
      Key: req.input.imagePath,
    });
    await r2.send(headCommand);
  } catch (_) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  // create temporary artifact
  const artifact = await prisma.artifact.create({
    data: {
      inputPath: req.input.imagePath,
      characterId: req.characterId,
      userId,
    },
  });

  // create worker job
  let jobId = '';
  try {
    const input = {
      input: {
        image_path: req.input.imagePath,
        artifact_id: artifact.id,
      },
      webhook: `https://tokimeki.ai/api/webhook/${artifact.id}`,
    };

    const { id } = await runpod.createJob(input);
    jobId = id;
  } catch (_) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  // update artifact
  const latestArtifact = await prisma.artifact.update({
    where: {
      id: artifact.id,
    },
    data: {
      status: ArtifactStatus.QUQUED,
      jobId,
    },
  });

  return {
    artifact: {
      id: latestArtifact.id,
      status: latestArtifact.status,
    },
  } as CreateArtifactResponse;
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
  const r2 = ctx.values.get(contextKeyR2);
  if (!r2) {
    throw new ConnectError('Internal Error', Code.Internal);
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

  // list images
  let objectUrls: string[] = [];
  try {
    objectUrls = await createObjectUrls(r2, artifact);
  } catch (_) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  // R2からartifact idのフォルダの中身をリストにしてすべてのファイルに署名する実装を追加する
  return {
    artifact: {
      id: artifact.id,
      status: artifact.status || 'ERROR',
      objectUrls,
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
  const r2 = ctx.values.get(contextKeyR2);
  if (!r2) {
    throw new ConnectError('Internal Error', Code.Internal);
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

  const results: Partial<Artifact>[] = await Promise.all(
    artifacts.map(async (artifact) => {
      // list images
      let objectUrls: string[] = [];
      try {
        objectUrls = await createObjectUrls(r2, artifact);
      } catch (_) {
        throw new ConnectError('Internal Error', Code.Internal);
      }

      return {
        id: artifact.id,
        status: artifact.status || 'ERROR',
        objectUrls,
      };
    }),
  );

  return {
    artifacts: results,
  } as ListArtifactsResponse;
};
