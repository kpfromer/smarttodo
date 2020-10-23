import * as React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { client } from '../../store/apollo';
import { MemoryRouter } from 'react-router-dom';

function render(ui: any, renderOptions: any = {}) {
  function Wrapper({ children }: any) {
    return (
      <MemoryRouter>
        <ApolloProvider client={client}>{children}</ApolloProvider>
      </MemoryRouter>
    );
  }
  const renderValues = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  return { ...renderValues, client };
}

export * from '@testing-library/react';
export { render };
