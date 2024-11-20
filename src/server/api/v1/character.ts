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
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const createCharacter: (
  req: CreateCharacterRequest,
  ctx: HandlerContext,
) => Promise<CreateCharacterResponse> = async () => {
  await wait(100);
  return {} as CreateCharacterResponse;
};

export const deleteCharacter: (
  req: DeleteCharacterRequest,
  ctx: HandlerContext,
) => Promise<DeleteCharacterResponse> = async () => {
  await wait(100);
  return {} as DeleteCharacterResponse;
};

export const getCharacter: (
  req: GetCharacterRequest,
  ctx: HandlerContext,
) => Promise<GetCharacterResponse> = async () => {
  await wait(100);
  return {} as GetCharacterResponse;
};

export const listCharacters: (
  req: ListCharactersRequest,
  ctx: HandlerContext,
) => Promise<ListCharactersResponse> = async () => {
  await wait(100);
  return {} as ListCharactersResponse;
};

export const updateCharacter: (
  req: UpdateCharacterRequest,
  ctx: HandlerContext,
) => Promise<UpdateCharacterResponse> = async () => {
  await wait(100);
  return {} as UpdateCharacterResponse;
};
