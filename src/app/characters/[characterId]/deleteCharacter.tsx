import { Button } from '@/components/ui/button.tsx';
import { API } from '@/libraries/connect-client';
import { useListCharacters } from '@/states/hooks/character.ts';
import { useRouter } from 'next/navigation';
import { type ReactElement, useState } from 'react';

type DeleteCharacterProps = {
  characterId: string;
};

export function DeleteCharacter({
  characterId,
}: DeleteCharacterProps): ReactElement {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const { refresh } = useListCharacters();

  async function deleteCharacter(id: string): Promise<void> {
    setLoading(true);
    await API.Character.deleteCharacter({
      characterId: id,
    });
    refresh();
    setLoading(false);
    router.push('/characters');
  }

  return (
    <>
      <Button
        onClick={() => deleteCharacter(characterId)}
        variant="outline"
        color="red"
        bg="transparent"
        borderColor="red"
        loading={loading}
        disabled={loading}
      >
        削除
      </Button>
    </>
  );
}
