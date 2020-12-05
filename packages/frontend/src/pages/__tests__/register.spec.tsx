import React from 'react';
import { graphql } from 'msw';
import { setupServer } from 'msw/node';
import { RegisterMutation, RegisterMutationVariables } from '../../generated/types-and-hooks';
import { render, screen, waitFor } from '../../utils/test/apollo_render';
import userEvent from '@testing-library/user-event';
import * as gatsby from 'gatsby';
import Register from '../register';

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Register page', () => {
  it('registers user', async () => {
    const accessToken = 'accessToken';
    const register = jest.fn((req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Mutation',
          createUser: accessToken,
        } as RegisterMutation),
      );
    });
    server.use(graphql.mutation<RegisterMutation, RegisterMutationVariables>('register', register));

    render(<Register />);

    userEvent.type(screen.getByLabelText(/email/i), 'example@email.com');
    userEvent.type(screen.getAllByLabelText(/password/i)[0], 'password123');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'password123');
    userEvent.click(screen.getByRole('button'));

    await waitFor(() => expect(gatsby.navigate).toHaveBeenCalled());
    expect(gatsby.navigate).toHaveBeenCalledWith('/app/');
    expect(register).toHaveBeenCalled();
    const registerBody = register.mock.calls[0][0].body;
    expect(registerBody.variables).toEqual({
      email: 'example@email.com',
      password: 'password123',
    });
  });
  it('does not submit if matching password does not match', async () => {
    const accessToken = 'accessToken';
    const register = jest.fn((req, res, ctx) => {
      return res(
        ctx.data({
          __typename: 'Mutation',
          createUser: accessToken,
        } as RegisterMutation),
      );
    });
    server.use(graphql.mutation<RegisterMutation, RegisterMutationVariables>('register', register));

    render(<Register />);

    userEvent.type(screen.getByLabelText(/email/i), 'example@email.com');
    userEvent.type(screen.getAllByLabelText(/password/i)[0], 'password123');
    userEvent.type(screen.getByLabelText(/confirm password/i), 'different');
    userEvent.click(screen.getByRole('button'));

    expect(await screen.findByText('Passwords must match!')).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
    expect(register).not.toHaveBeenCalled();
  });
  it.todo('shows already created user message from api');
});
