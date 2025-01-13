import type { JobStatusResult } from '@/libraries/runpod';
import { getRequestContext } from '@cloudflare/next-on-pages';
import { ArtifactStatus, PrismaClient } from '@prisma/client';
import { type NextRequest, NextResponse } from 'next/server';
import { connect } from '@tidbcloud/serverless';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

export const runtime = 'edge';

function initPrismaClient(): PrismaClient {
  const connection = connect({ url: getRequestContext().env.DATABASE_URL });
  const adapter = new PrismaTiDBCloud(connection);
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
