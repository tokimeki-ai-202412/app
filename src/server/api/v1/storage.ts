import type {
  CreateUploadUrlRequest,
  CreateUploadUrlResponse,
} from '@/libraries/connect-gen/api/v1/storage/api_pb';
import { contextKeyR2, contextKeyUserId } from '@/server/context';
import { GetProps } from '@/server/props.ts';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

export const createUploadUrl: (
  req: CreateUploadUrlRequest,
  ctx: HandlerContext,
) => Promise<CreateUploadUrlResponse> = async (req, ctx) => {
  const { userId, r2 } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Validate request
  if (req.length > 1024 * 1024 * 10) {
    throw new ConnectError('File is too large.', Code.InvalidArgument);
  }

  // Generate temporary upload url
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
