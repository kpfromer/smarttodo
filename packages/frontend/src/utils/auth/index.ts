import { LogoutDocument, LogoutMutation } from '../../generated/types-and-hooks';
import { client } from '../../store/apollo';
import { accessToken, isRefreshToken } from '../../store/cache';

export function login(token: string, rememberMe = false): void {
  accessToken(token);
  if (rememberMe) localStorage.setItem('loggedIn', 'true');
  else localStorage.removeItem('loggedIn');
}

export async function logout(): Promise<void> {
  localStorage.removeItem('loggedIn');
  await client.resetStore();
  accessToken(undefined);
  isRefreshToken(false);

  try {
    await client.mutate<LogoutMutation>({
      mutation: LogoutDocument,
    });
    localStorage.setItem('loggedIn', 'false');
  } catch {
    console.warn('Failed to logout with api.');
  }
}
