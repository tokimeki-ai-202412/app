import type { Artifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import deepEqual from 'fast-deep-equal';
import { atom } from 'jotai';
import { atomFamily } from 'jotai/utils';

export const getArtifactAtom = atomFamily(
  (_: string) => atom<Artifact | null>(null),
  deepEqual,
);

export const listArtifactAtom = atomFamily(
  (_: string) => atom<Artifact[] | null>(null),
  deepEqual,
);
