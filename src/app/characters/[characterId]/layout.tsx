import { getRequestContext } from '@cloudflare/next-on-pages';
import { PrismaClient } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import type { ReactElement, ReactNode } from 'react';
import { connect } from '@tidbcloud/serverless';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const connection = connect({ url: getRequestContext().env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
  // @ts-ignore
  return new PrismaClient({ adapter });
}

type Props = {
  params: { characterId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const characterId = params.characterId;
  const parentTitle = (await parent).title;

  const prisma = initPrismaClient();
  const { name } = await prisma.character.findFirstOrThrow({
    where: { id: characterId },
  });

  return {
    title: `${name} | ${parentTitle?.absolute}`,
  };
}

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): ReactElement {
  return <>{children}</>;
}
