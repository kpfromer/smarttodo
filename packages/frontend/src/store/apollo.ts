import {
  ApolloClient,
  ApolloLink,
  from,
  fromPromise,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import fetch from 'cross-fetch';
import { RefreshDocument, RefreshMutation } from '../generated/types-and-hooks';
import { accessToken } from '../store/cache';
import { logout } from '../utils/auth';

const getAccessToken = async () => {
  try {
    const { data } = await client.mutate<RefreshMutation>({
      mutation: RefreshDocument,
    });
    const token = data!.refresh;
    // Set new access token
    accessToken(token);
    return accessToken;
  } catch {
    // Invalid refresh token, remove token
    logout();
    // TODO: show message?
  }
  return;
};

const refreshTokenLink = onError(({ forward, operation, graphQLErrors }) => {
  if (graphQLErrors) {
    for (const error of graphQLErrors) {
      if (
        error.message === 'Access denied! You need to be authorized to perform this action!' ||
        error.extensions?.code === 'UNAUTHENTICATED'
      ) {
        return (
          fromPromise(getAccessToken())
            .filter((value) => !!value)
            // retry initial operation if access token was reset
            .flatMap(() => forward(operation))
        );
      }
    }
  }
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }: any) => {
    if (accessToken()) {
      return {
        headers: {
          ...headers,
          authorization: accessToken(),
        },
      };
    }
    return { headers };
  });
  return forward(operation);
});

export const client = new ApolloClient({
  link: from([
    refreshTokenLink,
    authLink,
    new HttpLink({
      uri:
        process.env.NODE_ENV === 'production'
          ? 'https://api.todo.kpfromer.com/graphql'
          : 'http://localhost:4000/graphql',
      fetch,
      credentials: 'include',
    }),
  ]),
  cache: new InMemoryCache(),
});
