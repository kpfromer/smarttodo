import React from 'react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import userEvent from '@testing-library/user-event';
import { waitFor } from '@testing-library/react';
import { screen, render } from '../utils/test/apollo_render';
import {
  LoginMutation,
  LoginMutationVariables
} from '../generated/types-and-hooks';
import { LoginPage } from './LoginPage';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Login page', () => {
  let login: jest.Mock;
  beforeEach(() => {
    login = jest.fn((req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Mutation',
          login: 'token'
        })
      );
    });
    server.use(
      graphql.mutation<LoginMutation, LoginMutationVariables>('login', login)
    );
  });

  it('logins user', async () => {
    render(<LoginPage />);

    // wait for header cache login
    await screen.findByTestId('loginHeader');

    userEvent.type(screen.getByLabelText(/email/i), 'example@email.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button'));

    // TODO:
    // await waitFor(() => expect(gatsby.navigate).toHaveBeenCalled());
    // expect(gatsby.navigate).toHaveBeenCalledWith('/app/');
    // expect(login).toHaveBeenCalled();

    await waitFor(() => expect(login).toHaveBeenCalled());

    const loginBody = login.mock.calls[0][0].body;
    expect(loginBody.variables).toMatchInlineSnapshot(`
      Object {
        "email": "example@email.com",
        "password": "password123",
        "rememberMe": true,
      }
    `);
  });
});
