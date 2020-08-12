import * as React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { ApolloProvider } from '@apollo/client';
import { client } from '../../store/apollo';

function render(ui: any, renderOptions: any = {}) {
  function Wrapper({ children }: any) {
    return <ApolloProvider client={client}>{children}</ApolloProvider>;
  }
  const renderValues = rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
  return { ...renderValues, client };
}

export * from '@testing-library/react';
export { render };
