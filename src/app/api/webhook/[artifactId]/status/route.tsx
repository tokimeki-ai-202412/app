import { modelData } from '@/const/model.ts';
import { CreateRunpod, type RunpodClient } from '@/libraries/runpod';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { Code, ConnectError } from '@connectrpc/connect';
import { Client } from '@planetscale/database';
import { PrismaPlanetScale } from '@prisma/adapter-planetscale';
import { ArtifactStatus, PrismaClient } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

function getEndpointById(id: string): string {
  const model = modelData.find((m) => m.id === id);
  if (!model) {
    throw new ConnectError('Model not found', Code.NotFound);
  }
  return model.endpoint;
}

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

function initRunpod(): RunpodClient {
  return CreateRunpod(getRequestContext().env.RUNPOD_API_TOKEN);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { artifactId: string } },
) {
  const { artifactId } = params;

  try {
    // init prisma
    const prisma = initPrismaClient();
    // get artifact
    const artifact = await prisma.artifact.findFirstOrThrow({
      where: {
        id: artifactId,
      },
    });

    // Job has not been created
    if (!artifact.jobId) {
      return NextResponse.json({ error: 'Job was not found' }, { status: 404 });
    }

    // Get model endpoint
    const endpoint = getEndpointById(artifact.modelId);

    // Job is ended
    if (
      artifact.status === 'DONE' ||
      artifact.status === 'CANCELED' ||
      artifact.status === 'ERROR'
    ) {
      return NextResponse.json({ error: 'Status is locked.' }, { status: 423 });
    }

    // Job should be suspended
    if (new Date(artifact.createdAt) < new Date(Date.now() - 10 * 60 * 1000)) {
      await prisma.artifact.update({
        where: {
          id: artifact.id,
        },
        data: {
          status: ArtifactStatus.ERROR,
        },
      });
      return NextResponse.json(null, { status: 200 });
    }

    const runpod = initRunpod();
    const { status } = await runpod.getJobStatus(endpoint, artifact.jobId);

    if (status !== 'IN_PROGRESS') {
      return NextResponse.json(null, { status: 200 });
    }

    // update artifact status to GENERATING
    await prisma.artifact.update({
      where: {
        id: artifact.id,
      },
      data: {
        status: ArtifactStatus.GENERATING,
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
