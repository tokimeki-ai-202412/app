import type {
  WhoisRequest,
  WhoisResponse,
} from '@/libraries/connect-gen/api/v1/user/api_pb';
import { GetProps } from '@/server/props.ts';
import { Code, ConnectError, type HandlerContext } from '@connectrpc/connect';

export const whois: (
  req: WhoisRequest,
  ctx: HandlerContext,
) => Promise<WhoisResponse> = async (_, ctx) => {
  const { userId, prisma } = GetProps(ctx);
  if (!userId) {
    throw new ConnectError('Unauthenticated', Code.Unauthenticated);
  }

  // Get user
  const user = await prisma.user
    .findFirstOrThrow({
      where: { id: userId },
    })
    .catch(() => {
      throw new ConnectError('permission denied', Code.PermissionDenied);
    });

  return {
    user: {
      id: user.id,
      jewelRemain: user.jewelRemain,
    },
  } as WhoisResponse;
};
