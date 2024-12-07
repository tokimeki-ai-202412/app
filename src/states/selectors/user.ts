import { API } from '@/libraries/connect-client';
import { atomWithCache } from 'jotai-cache';
import { atom } from 'jotai/index';
import { atomWithRefresh, loadable } from 'jotai/utils';

export const whoisSelector = atomWithRefresh(async () => {
  const res = await API.User.whois({});
  if (!res.user) throw new Error('api internal error');
  return res.user;
});

export const whoisSelectorWithRefresh = atom(
  (get) => get(loadable(whoisSelector)),
  (get, set) => set(whoisSelector),
);
