import type {
  CreateUploadUrlRequest,
  CreateUploadUrlResponse,
} from '@/libraries/connect-gen/api/v1/storage/api_pb';
import { contextKeyR2, contextKeyUserId } from '@/server/context';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

export const createUploadUrl: (
  req: CreateUploadUrlRequest,
  ctx: HandlerContext,
) => Promise<CreateUploadUrlResponse> = async (req, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  const r2 = ctx.values.get(contextKeyR2);
  if (!r2) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  if (req.length > 1024 * 1024 * 10) {
    throw new ConnectError('File is too large', Code.InvalidArgument);
  }

  const path = `temporary/${crypto.randomUUID()}`;
  const url = await getSignedUrl(
    r2,
    new PutObjectCommand({
      Bucket: 'tokimeki',
      Key: path,
      ContentLength: req.length,
    }),
    { expiresIn: 600 },
  );

  return {
    url,
    path,
  } as CreateUploadUrlResponse;
};
