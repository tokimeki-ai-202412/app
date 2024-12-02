import type { Artifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { getArtifactAtom, listArtifactAtom } from '@/states/atoms/artifact.ts';
import {
  getArtifactSelector,
  listArtifactSelectorWithRefresh,
} from '@/states/selectors/artifact.ts';
import type { Message } from '@bufbuild/protobuf';
import { useAtom } from 'jotai';
import { atomWithReducer, loadable } from 'jotai/utils';
import { useCallback, useEffect, useState } from 'react';

export function useGetArtifact(id: string): {
  loading: boolean;
  artifact: Omit<Artifact, keyof Message> | null;
  refresh: () => void;
} {
  const [artifact, setArtifact] = useAtom(getArtifactAtom(id));
  const [value, refresh] = useAtom(loadable(getArtifactSelector(id)));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value.state === 'hasData') {
      setArtifact(value.data);
    }
  }, [value.state]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (value.state !== 'loading') {
      setLoading(false);
    }
  }, [value.state]);

  return { loading, artifact, refresh };
}

export function useListArtifact(id: string): {
  loading: boolean;
  artifacts: Omit<Artifact, keyof Message>[] | null;
  refresh: () => void;
  updateArtifact: (artifact: Artifact) => void;
  deleteArtifact: (artifactId: string) => void;
} {
  const [artifacts, setArtifacts] = useAtom(listArtifactAtom(id));
  const [value, refresh] = useAtom(listArtifactSelectorWithRefresh(id));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value.state === 'hasData') {
      setArtifacts(value.data);
    }
  }, [value.state]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (value.state !== 'loading') {
      setLoading(false);
    }
  }, [value.state]);

  // artifactsから特定のidを持つアーティファクトを置き換える関数
  const updateArtifact = useCallback(
    (updatedArtifact: Artifact) => {
      setArtifacts((prevArtifacts) => {
        if (!prevArtifacts) return prevArtifacts;
        return prevArtifacts.map((artifact) =>
          artifact.id === updatedArtifact.id ? updatedArtifact : artifact,
        );
      });
    },
    [setArtifacts],
  );

  const deleteArtifact = useCallback(
    (artifactId: string) => {
      setArtifacts((prevArtifacts) => {
        if (!prevArtifacts) return prevArtifacts;
        return prevArtifacts.filter((artifact) => artifact.id !== artifactId);
      });
    },
    [setArtifacts],
  );

  return { loading, artifacts, refresh, updateArtifact, deleteArtifact };
}
