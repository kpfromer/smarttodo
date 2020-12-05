import React from 'react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import { LoginMutationVariables, LoginMutation } from '../../generated/types-and-hooks';
import { render, screen, waitFor } from '../../utils/test/apollo_render';
import Login from '../login';
import userEvent from '@testing-library/user-event';
import * as gatsby from 'gatsby';

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
          login: 'token',
        }),
      );
    });
    server.use(graphql.mutation<LoginMutation, LoginMutationVariables>('login', login));
  });

  it('logins user', async () => {
    render(<Login />);

    // wait for header cache login
    await screen.findByTestId('loginHeader');

    userEvent.type(screen.getByLabelText(/email/i), 'example@email.com');
    userEvent.type(screen.getByLabelText(/password/i), 'password123');
    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(gatsby.navigate).toHaveBeenCalled());
    expect(gatsby.navigate).toHaveBeenCalledWith('/app/');
    expect(login).toHaveBeenCalled();
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
