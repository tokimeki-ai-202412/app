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
import {
  contextKeyPrisma,
  contextKeyR2,
  contextKeyUserId,
} from '@/server/context.ts';
import { GetProps } from '@/server/props.ts';
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

export const createCharacter: (
  req: CreateCharacterRequest,
  ctx: HandlerContext,
) => Promise<CreateCharacterResponse> = async (req, ctx) => {
  const { userId, prisma, r2, generateDownloadUrl } = GetProps(ctx);
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
      Bucket: 'tokimeki',
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
      Bucket: 'tokimeki',
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
  const { userId, prisma } = GetProps(ctx);
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
