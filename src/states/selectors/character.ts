import { API } from '@/libraries/connect-client';
import deepEqual from 'fast-deep-equal';
import { atomWithCache } from 'jotai-cache';
import { atomFamily } from 'jotai/utils';

export const getCharacterSelector = atomFamily(
  (id: string) =>
    atomWithCache(async () => {
      const res = await API.Character.getCharacter({ characterId: id });
      if (!res.character) throw new Error('api internal error');
      return res.character;
    }),
  deepEqual,
);

export const listCharactersSelector = atomWithCache(async () => {
  const res = await API.Character.listCharacters({});
  if (!res.characters) throw new Error('api internal error');
  return res.characters;
});
