import { API } from '@/libraries/connect-client';
import { atomWithCache } from 'jotai-cache';

export const whoisSelector = atomWithCache(async () => {
  const res = await API.User.whois({});
  if (!res.user) throw new Error('api internal error');
  return res.user;
});
