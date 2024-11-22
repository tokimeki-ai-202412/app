import type { Character } from '@/libraries/connect-gen/model/v1/character_pb.ts';
import deepEqual from 'fast-deep-equal';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const getCharacterAtom = atomFamily(
  (_: string) => atom<Character | null>(null),
  deepEqual,
);

export const listCharactersAtom = atom<Character[] | null>(null);
