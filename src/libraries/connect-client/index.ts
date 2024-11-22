import { Service as UserService } from '@/libraries/connect-gen/api/v1/user/api_connect';
import { createPromiseClient } from '@bufbuild/connect';
import { createConnectTransport } from '@bufbuild/connect-web';

const Transport = createConnectTransport({
  baseUrl: '/api/',
  useBinaryFormat: process.env.NODE_ENV === 'production',
  credentials: 'include',
  interceptors: [],
});

export const API = {
  User: createPromiseClient(UserService, Transport),
};
