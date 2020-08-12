import React from 'react';
import { render, screen } from '../../utils/test/apollo_render';
import NotFoundPage from '../404';

describe('404 page', () => {
  it('shows a 404 error message', async () => {
    render(<NotFoundPage />);

    // wait for header cache login
    await screen.findByText(/login/i);

    expect(screen.getByText(/not found/i)).toBeInTheDocument();
  });
});
