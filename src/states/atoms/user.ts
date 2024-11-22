import type { User } from '@/libraries/connect-gen/model/v1/user_pb';
import { atom } from 'jotai';

export const whoisAtom = atom<User | null>(null);
