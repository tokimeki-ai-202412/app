import { API } from '@/libraries/connect-client';
import deepEqual from 'fast-deep-equal';
import { atomWithCache } from 'jotai-cache';
import { atom } from 'jotai/index';
import { atomFamily, atomWithRefresh, loadable } from 'jotai/utils';

export const getCharacterSelector = atomFamily(
  (id: string) =>
    atomWithCache(async () => {
      const res = await API.Character.getCharacter({ characterId: id });
      if (!res.character) throw new Error('api internal error');
      return res.character;
    }),
  deepEqual,
);

const listCharactersSelector = atomWithRefresh(async () => {
  const res = await API.Character.listCharacters({});
  if (!res.characters) throw new Error('api internal error');
  return res.characters;
});

export const listCharactersSelectorWithRefresh = atom(
  (get) => get(loadable(listCharactersSelector)),
  (get, set) => set(listCharactersSelector),
);
