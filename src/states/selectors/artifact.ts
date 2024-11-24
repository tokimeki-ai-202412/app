import { API } from '@/libraries/connect-client';
import deepEqual from 'fast-deep-equal';
import { atomWithCache } from 'jotai-cache';
import { atomFamily } from 'jotai/utils';

export const getArtifactSelector = atomFamily(
  (artifactId: string) =>
    atomWithCache(async () => {
      const res = await API.Artifact.getArtifact({ artifactId });
      if (!res.artifact) throw new Error('api internal error');
      return res.artifact;
    }),
  deepEqual,
);

export const listArtifactSelector = atomFamily(
  (characterId: string) =>
    atomWithCache(async () => {
      const res = await API.Artifact.listArtifacts({ characterId });
      if (!res.artifacts) throw new Error('api internal error');
      return res.artifacts;
    }),
  deepEqual,
);
