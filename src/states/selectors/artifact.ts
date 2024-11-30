import { API } from '@/libraries/connect-client';
import deepEqual from 'fast-deep-equal';
import { atom } from 'jotai';
import { atomWithCache } from 'jotai-cache';
import {
  atomFamily,
  atomWithDefault,
  atomWithRefresh,
  atomWithReset,
  loadable,
} from 'jotai/utils';

export const getArtifactSelector = atomFamily(
  (artifactId: string) =>
    atomWithCache(async () => {
      const res = await API.Artifact.getArtifact({ artifactId });
      if (!res.artifact) throw new Error('api internal error');
      return res.artifact;
    }),
  deepEqual,
);

const listArtifactSelector = atomFamily(
  (characterId: string) =>
    atomWithRefresh(async () => {
      const res = await API.Artifact.listArtifacts({ characterId });
      if (!res.artifacts) throw new Error('api internal error');
      return res.artifacts;
    }),
  deepEqual,
);

export const listArtifactSelectorWithRefresh = atomFamily(
  (characterId: string) =>
    atom(
      (get) => get(loadable(listArtifactSelector(characterId))),
      (get, set) => set(listArtifactSelector(characterId)),
    ),
);
