import { contextKeyPrisma, contextKeyUserId } from '@/server/context';
import type { Interceptor } from '@connectrpc/connect';
import { Code, ConnectError } from '@connectrpc/connect';
import { parse } from 'cookie';

export const authenticator: Interceptor = (next) => async (req) => {
  const prisma = req.contextValues.get(contextKeyPrisma);
  if (!prisma) {
    throw new ConnectError('Internal Error', Code.Internal);
  }

  const cookies = parse(req.header.get('cookie') || '');
  const sessionId = cookies.token;
  if (!sessionId) return await next(req);

  const session = await prisma.session.findFirst({
    where: {
      id: sessionId,
    },
  });
  if (!session) return await next(req);

  req.contextValues.set(contextKeyUserId, session.userId);
  return await next(req);
};
