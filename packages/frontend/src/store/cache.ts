import { makeVar } from '@apollo/client';

export const accessToken = makeVar<undefined | string>(undefined);
export const isRefreshToken = makeVar<boolean>(
  typeof window !== 'undefined' && localStorage.getItem('loggedIn') === 'true',
);
