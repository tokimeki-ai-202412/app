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
import { contextKeyPrisma, contextKeyUserId } from '@/server/context.ts';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createCharacter: (
  req: CreateCharacterRequest,
  ctx: HandlerContext,
) => Promise<CreateCharacterResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  if (req.name === '') {
    throw new ConnectError('Invalid Argument', Code.InvalidArgument);
  }

  const character = await prisma.character.create({
    data: {
      name: req.name,
      thumbnailPath: req.thumbnailPath,
      userId,
    },
  });

  // thumbnailPathが存在する場合、signed urlを発行する

  return {
    character: {
      id: character.id,
      name: character.name,
      thumbnailPath: character.thumbnailPath,
    },
  } as CreateCharacterResponse;
};

export const deleteCharacter: (
  req: DeleteCharacterRequest,
  ctx: HandlerContext,
) => Promise<DeleteCharacterResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const character = await prisma.character.findFirstOrThrow({
    where: {
      id: req.characterId,
    },
  });

  if (character.userId !== userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  await prisma.character.delete({
    where: {
      id: req.characterId,
    },
  });

  return {} as DeleteCharacterResponse;
};

export const getCharacter: (
  req: GetCharacterRequest,
  ctx: HandlerContext,
) => Promise<GetCharacterResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const character = await prisma.character.findFirstOrThrow({
    where: {
      id: req.characterId,
    },
  });

  if (character.userId !== userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // thumbnailPathが存在する場合、signed urlを発行する

  return {
    character: {
      id: character.id,
      name: character.name,
      thumbnailPath: character.thumbnailPath,
    },
  } as GetCharacterResponse;
};

export const listCharacters: (
  req: ListCharactersRequest,
  ctx: HandlerContext,
) => Promise<ListCharactersResponse> = async (_, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const characters = await prisma.character.findMany({
    where: {
      userId,
    },
  });

  // thumbnailPathが存在する場合、signed urlを発行する

  const results: Partial<Character>[] = characters.map((character) => ({
    id: character.id,
    name: character.name,
    thumbnailPath: character.thumbnailPath,
  }));

  return {
    characters: results,
  } as ListCharactersResponse;
};

export const updateCharacter: (
  req: UpdateCharacterRequest,
  ctx: HandlerContext,
) => Promise<UpdateCharacterResponse> = async (_, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  await wait(100);
  return {} as UpdateCharacterResponse;
};
