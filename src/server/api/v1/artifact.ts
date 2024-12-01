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
import { GetProps } from '@/server/props.ts';
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
  const { userId, prisma, runpod } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Get artifact
  let artifact = await prisma.artifact
    .findFirstOrThrow({
      where: {
        id: req.artifactId,
        userId,
      },
    })
    .catch(() => {
      throw new ConnectError('Artifact not found', Code.NotFound);
    });

  // Check artifact is active
  if (
    artifact.status === ArtifactStatus.QUEUED ||
    artifact.status === ArtifactStatus.GENERATING
  ) {
    if (!artifact.jobId) {
      throw new ConnectError('Broken artifact', Code.PermissionDenied);
    }

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

  return {
    artifact: {
      id: artifact.id,
      status: artifact.status,
    },
  } as CancelArtifactResponse;
};

export const createArtifact: (
  req: CreateArtifactRequest,
  ctx: HandlerContext,
) => Promise<CreateArtifactResponse> = async (req, ctx) => {
  const { userId, prisma, r2, runpod, bucketName, originUrl } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Validate request
  if (!req.input) {
    throw new ConnectError('Invalid input.', Code.InvalidArgument);
  }
  if (!req.input.imagePath.startsWith('temporary/')) {
    throw new ConnectError('Invalid image.', Code.InvalidArgument);
  }

  // Rate limiting
  const queuedCount = await prisma.artifact.count({
    where: {
      userId,
      OR: [
        { status: ArtifactStatus.QUEUED },
        { status: ArtifactStatus.GENERATING },
      ],
    },
  });
  if (queuedCount > 3) {
    throw new ConnectError('You have too many queue.', Code.Unknown);
  }

  // Validate temporary file
  const headCommand = new HeadObjectCommand({
    Bucket: bucketName,
    Key: req.input.imagePath,
  });
  await r2.send(headCommand).catch(() => {
    throw new ConnectError('Invalid input image.', Code.InvalidArgument);
  });

  // Get character
  const character = await prisma.character
    .findFirstOrThrow({
      where: {
        id: req.characterId,
        userId,
      },
    })
    .catch(() => {
      throw new ConnectError('Character not found.', Code.NotFound);
    });

  // Create temporary artifact
  const artifact = await prisma.artifact.create({
    data: {
      inputPath: req.input.imagePath,
      characterId: character.id,
      userId,
    },
  });

  // Create worker job
  const input = {
    input: {
      image_path: req.input.imagePath,
      artifact_id: artifact.id,
    },
    webhook: `${originUrl}/api/webhook/${artifact.id}`,
  };
  const { id: jobId } = await runpod.createJob(input).catch(() => {
    throw new ConnectError('Internal Error', Code.Internal);
  });

  // Update artifact
  const latestArtifact = await prisma.artifact.update({
    where: {
      id: artifact.id,
    },
    data: {
      status: ArtifactStatus.QUEUED,
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
  const { userId, prisma, r2 } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Get artifact
  const artifact = await prisma.artifact
    .findFirstOrThrow({
      where: {
        id: req.artifactId,
        userId,
      },
    })
    .catch(() => {
      throw new ConnectError('Artifact not found', Code.NotFound);
    });

  // List images
  let objectUrls: string[] = [];
  objectUrls = await createObjectUrls(r2, artifact).catch(() => {
    throw new ConnectError('Failed to generate object urls.', Code.Internal);
  });

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
  const { userId, prisma, r2 } = GetProps(ctx);

  // Auth required
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  /// Get artifacts
  const artifacts = await prisma.artifact
    .findMany({
      where: {
        characterId: req.characterId,
        userId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
    .catch(() => {
      throw new ConnectError('Failed to fetch artifacts.', Code.Internal);
    });

  // Prepare results
  const results: Partial<Artifact>[] = await Promise.all(
    artifacts.map(async (artifact) => {
      // List images
      let objectUrls: string[] = [];
      objectUrls = await createObjectUrls(r2, artifact).catch(() => {
        throw new ConnectError(
          'Failed to generate object urls.',
          Code.Internal,
        );
      });
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
