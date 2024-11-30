import type { Character } from '@/libraries/connect-gen/model/v1/character_pb.ts';
import { getCharacterAtom, listCharactersAtom } from '@/states/atoms/character';
import {
  getCharacterSelector,
  listCharactersSelectorWithRefresh,
} from '@/states/selectors/character';
import type { Message } from '@bufbuild/protobuf';
import { useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect, useState } from 'react';

export function useGetCharacter(id: string): {
  loading: boolean;
  character: Omit<Character, keyof Message> | null;
} {
  const [character, setCharacter] = useAtom(getCharacterAtom(id));
  const [value] = useAtom(loadable(getCharacterSelector(id)));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value.state === 'hasData') {
      setCharacter(value.data);
    }
  }, [value.state]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (value.state !== 'loading') {
      setLoading(false);
    }
  }, [value.state]);

  return { loading, character };
}

export function useListCharacters(): {
  loading: boolean;
  characters: Omit<Character[], keyof Message> | null;
  refresh: () => void;
} {
  const [characters, setCharacters] = useAtom(listCharactersAtom);
  const [value, refresh] = useAtom(listCharactersSelectorWithRefresh);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value.state === 'hasData') {
      setCharacters(value.data);
    }
  }, [value.state]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (value.state !== 'loading') {
      setLoading(false);
    }
  }, [value.state]);

  return { loading, characters, refresh };
}
