import { useReactiveVar } from '@apollo/client';
import { accessToken, isRefreshToken } from '../../store/cache';

export function useIsLoggedIn(): boolean {
  const accessTokenValue = useReactiveVar(accessToken);
  const refreshTokenValue = useReactiveVar(isRefreshToken);

  return !!accessTokenValue || !!refreshTokenValue;
}
