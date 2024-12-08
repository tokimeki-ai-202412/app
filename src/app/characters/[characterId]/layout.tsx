import { getRequestContext } from '@cloudflare/next-on-pages';
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { PrismaClient } from '@prisma/client';
import type { Metadata, ResolvingMetadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const client = new Client({
    url: getRequestContext().env.DATABASE_URL,
    fetch: (url, init) => {
      if (init) {
        // biome-ignore lint/performance/noDelete: <explanation>
        delete init['cache'];
      }
      return fetch(url, init);
    },
  });
  const adapter = new PrismaPlanetScale(client);
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
