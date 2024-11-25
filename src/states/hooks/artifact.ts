import type { Artifact } from '@/libraries/connect-gen/model/v1/artifact_pb.ts';
import { getArtifactAtom, listArtifactAtom } from '@/states/atoms/artifact.ts';
import {
  getArtifactSelector,
  listArtifactSelectorWithRefresh,
} from '@/states/selectors/artifact.ts';
import type { Message } from '@bufbuild/protobuf';
import { useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect, useState } from 'react';

export function useGetArtifact(id: string): {
  loading: boolean;
  artifact: Omit<Artifact, keyof Message> | null;
} {
  const [artifact, setArtifact] = useAtom(getArtifactAtom(id));
  const [value] = useAtom(loadable(getArtifactSelector(id)));

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

  return { loading, artifact };
}

export function useListArtifact(id: string): {
  loading: boolean;
  artifacts: Omit<Artifact, keyof Message>[] | null;
  refresh: () => void;
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

  return { loading, artifacts, refresh };
}
