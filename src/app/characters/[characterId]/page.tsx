'use client';

import { useListArtifact } from '@/states/hooks/artifact.ts';
import { useGetCharacter } from '@/states/hooks/character.ts';
import type { ReactElement } from 'react';

export const runtime = 'edge';

type Props = {
  params: {
    characterId: string;
  };
};

export default function Page({ params: { characterId } }: Props): ReactElement {
  const { artifacts } = useListArtifact(characterId);
  const { character } = useGetCharacter(characterId);

  return (
    <>
      {JSON.stringify(character)}
      {JSON.stringify(artifacts)}
    </>
  );
}
