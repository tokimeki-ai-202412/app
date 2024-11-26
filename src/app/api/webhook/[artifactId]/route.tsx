import type { JobStatusResult } from '@/libraries/runpod';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { ArtifactStatus, PrismaClient } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

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

export async function POST(
  req: NextRequest,
  { params }: { params: { artifactId: string } },
) {
  const { artifactId } = params;

  try {
    const body: JobStatusResult = await req.json();

    console.log(JSON.stringify(body));

    // init prisma
    const prisma = initPrismaClient();
    // get artifact
    const artifact = await prisma.artifact.findFirstOrThrow({
      where: {
        id: artifactId,
      },
    });

    if (artifact.jobId !== body.id) {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 401 });
    }

    // update status
    let status: ArtifactStatus = artifact.status || ArtifactStatus.ERROR;
    if (body.status === 'COMPLETED') {
      status = ArtifactStatus.DONE;
    } else if (body.status === 'FAILED' || body.status === 'TIMED_OUT') {
      status = ArtifactStatus.ERROR;
    } else if (body.status === 'CANCELLED') {
      status = ArtifactStatus.CANCELED;
    }

    // update artifact
    await prisma.artifact.update({
      where: {
        id: artifact.id,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(null, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: 'An error occurred while handling the webhook.' },
      { status: 500 },
    );
  }
}
