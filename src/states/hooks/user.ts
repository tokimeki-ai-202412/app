import type { User } from '@/libraries/connect-gen/model/v1/user_pb';
import { whoisAtom } from '@/states/atoms/user';
import {
  whoisSelector,
  whoisSelectorWithRefresh,
} from '@/states/selectors/user';
import type { Message } from '@bufbuild/protobuf';
import { useAtom } from 'jotai';
import { loadable } from 'jotai/utils';
import { useEffect, useState } from 'react';

export function useWhois(): {
  loading: boolean;
  user: Omit<User, keyof Message> | null;
  refresh: () => void;
} {
  const [user, setUser] = useAtom(whoisAtom);
  const [value, refresh] = useAtom(whoisSelectorWithRefresh);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value.state === 'hasData') {
      setUser(value.data);
    }
  }, [value.state]);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (value.state !== 'loading') {
      setLoading(false);
    }
  }, [value.state]);

  return { loading, user, refresh };
}
