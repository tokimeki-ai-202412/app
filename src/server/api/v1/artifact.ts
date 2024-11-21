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
) => Promise<GetArtifactResponse> = async () => {
  await wait(100);
  return {} as GetArtifactResponse;
};

export const listArtifacts: (
  req: ListArtifactsRequest,
  ctx: HandlerContext,
) => Promise<ListArtifactsResponse> = async () => {
  await wait(100);
  return {} as ListArtifactsResponse;
};
