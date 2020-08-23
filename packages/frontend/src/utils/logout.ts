import { token } from '../store/cache';
import { client } from '../store/apollo';
import { LogoutDocument, LogoutMutation } from '../generated/types-and-hooks';

export const logout = async (): Promise<void> => {
  try {
    await client.mutate<LogoutMutation>({
      mutation: LogoutDocument
    });
    localStorage.setItem('loggedIn', 'false');
  } catch {
    console.warn('Failed to logout with api.');
  }
  token(undefined);
};
