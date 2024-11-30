import type {
  CreateCharacterRequest,
  CreateCharacterResponse,
  DeleteCharacterRequest,
  DeleteCharacterResponse,
  GetCharacterRequest,
  GetCharacterResponse,
  ListCharactersRequest,
  ListCharactersResponse,
  UpdateCharacterRequest,
  UpdateCharacterResponse,
} from '@/libraries/connect-gen/api/v1/character/api_pb';
import type { Character } from '@/libraries/connect-gen/model/v1/character_pb.ts';
import { GetProps } from '@/server/props.ts';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  HeadObjectCommand,
  ListObjectsV2Command,
} from '@aws-sdk/client-s3';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

export const createCharacter: (
  req: CreateCharacterRequest,
  ctx: HandlerContext,
) => Promise<CreateCharacterResponse> = async (req, ctx) => {
  const { userId, prisma, r2, bucketName, generateDownloadUrl } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Validate request
  if (req.name === '') {
    throw new ConnectError('Name required.', Code.InvalidArgument);
  }
  if (!req.thumbnailPath.startsWith('temporary/')) {
    throw new ConnectError('Thumbnail required.', Code.InvalidArgument);
  }
  // Check temporary file is valid
  try {
    const headCommand = new HeadObjectCommand({
      Bucket: bucketName,
      Key: req.thumbnailPath,
    });
    await r2.send(headCommand);
  } catch (_) {
    throw new ConnectError('Invalid thumbnail.', Code.InvalidArgument);
  }

  // Activate thumbnail
  try {
    const thumbnailPath = `characters/thumbnail/${crypto.randomUUID()}`;
    const copyCommand = new CopyObjectCommand({
      Bucket: bucketName,
      CopySource: `tokimeki/${req.thumbnailPath}`,
      Key: thumbnailPath,
    });
    await r2.send(copyCommand);

    req.thumbnailPath = thumbnailPath;
  } catch (_) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  // Create character
  const character = await prisma.character.create({
    data: {
      name: req.name,
      thumbnailPath: req.thumbnailPath,
      userId,
    },
  });

  // Generate thumbnail url
  let thumbnailUrl = '';
  if (character.thumbnailPath !== '') {
    thumbnailUrl = await generateDownloadUrl(r2, character.thumbnailPath);
  }

  return {
    character: {
      id: character.id,
      name: character.name,
      thumbnailUrl,
    },
  } as CreateCharacterResponse;
};

export const deleteCharacter: (
  req: DeleteCharacterRequest,
  ctx: HandlerContext,
) => Promise<DeleteCharacterResponse> = async (req, ctx) => {
  const { userId, prisma, r2, bucketName } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

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

  // Get all artifacts
  const artifacts = await prisma.artifact
    .findMany({
      where: {
        characterId: req.characterId,
        userId,
      },
    })
    .catch(() => {
      throw new ConnectError('Failed to fetch artifacts.', Code.Internal);
    });

  // Cleanup artifact objects
  artifacts.map(async (artifact) => {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `artifacts/${artifact.id}/`,
      Delimiter: '/',
    });

    // Get all files
    const response = await r2.send(command).catch(() => {
      throw new ConnectError(
        'Failed to fetch artifact objects.',
        Code.Internal,
      );
    });
    if (response.Contents) {
      const results = response.Contents.map((item) => item.Key);
      const files = results.filter(
        (item): item is string => item !== undefined,
      );
      // Delete all files
      if (files.length > 0) {
        const deleteCommand = new DeleteObjectsCommand({
          Bucket: bucketName,
          Delete: {
            Objects: files.map((key) => ({ Key: key })),
          },
        });
        await r2.send(deleteCommand).catch(() => {
          throw new ConnectError(
            'Failed to delete artifact objects.',
            Code.Internal,
          );
        });
      }
    }
  });

  // Cleanup thumbnail
  if (character.thumbnailPath) {
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: character.thumbnailPath,
    });
    await r2.send(deleteCommand).catch(() => {
      throw new ConnectError(
        'Failed to delete character thumbnail.',
        Code.Internal,
      );
    });
  }

  // Delete artifacts related to the character
  await prisma.artifact.deleteMany({
    where: {
      characterId: character.id,
      userId,
    },
  });

  // Delete character
  await prisma.character.delete({
    where: {
      id: character.id,
    },
  });

  return {} as DeleteCharacterResponse;
};

export const getCharacter: (
  req: GetCharacterRequest,
  ctx: HandlerContext,
) => Promise<GetCharacterResponse> = async (req, ctx) => {
  const { userId, prisma, r2, generateDownloadUrl } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

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

  // Generate thumbnail url
  let thumbnailUrl = '';
  if (character.thumbnailPath !== '') {
    thumbnailUrl = await generateDownloadUrl(r2, character.thumbnailPath);
  }

  return {
    character: {
      id: character.id,
      name: character.name,
      thumbnailUrl,
    },
  } as GetCharacterResponse;
};

export const listCharacters: (
  req: ListCharactersRequest,
  ctx: HandlerContext,
) => Promise<ListCharactersResponse> = async (_, ctx) => {
  const { userId, prisma, r2, generateDownloadUrl } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Get characters
  const characters = await prisma.character.findMany({
    where: {
      userId,
    },
  });

  // Prepare results
  const results: Partial<Character>[] = await Promise.all(
    characters.map(async (character) => {
      let thumbnailUrl = '';
      if (character.thumbnailPath !== '') {
        thumbnailUrl = await generateDownloadUrl(r2, character.thumbnailPath);
      }

      return {
        id: character.id,
        name: character.name,
        thumbnailUrl,
      };
    }),
  );

  return {
    characters: results,
  } as ListCharactersResponse;
};

export const updateCharacter: (
  req: UpdateCharacterRequest,
  ctx: HandlerContext,
) => Promise<UpdateCharacterResponse> = (_, ctx) => {
  const { userId } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  throw new ConnectError('Unimplemented method.', Code.Unimplemented);
};
