import type {
  WhoisRequest,
  WhoisResponse,
} from '@/libraries/connect-gen/api/v1/user/api_pb';
import { contextKeyPrisma, contextKeyUserId } from '@/server/context';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

export const whois: (
  req: WhoisRequest,
  ctx: HandlerContext,
) => Promise<WhoisResponse> = async (_, ctx) => {
  const userId = ctx.values.get(contextKeyUserId);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }
  const prisma = ctx.values.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const user = await prisma.user
    .findFirstOrThrow({
      where: { id: userId },
    })
    .catch(() => {
      throw new ConnectError('Internal Error', Code.Internal);
    });

  return {
    user: {
      id: user.id,
    },
  } as WhoisResponse;
};
