import '@testing-library/jest-dom';
// Mocks
import React from 'react';
const gatsby = jest.requireActual('gatsby');

jest.mock('gatsby', () => ({
  ...gatsby,
  graphql: jest.fn().mockImplementation(() => ({})),
  Link: jest.fn().mockImplementation(
    // these props are invalid for an `a` tag
    ({
      activeClassName,
      activeStyle,
      getProps,
      innerRef,
      partiallyActive,
      ref,
      replace,
      to,
      ...rest
    }) =>
      React.createElement('a', {
        ...rest,
        href: to,
      }),
  ),
  StaticQuery: jest.fn(),
  useStaticQuery: jest.fn().mockImplementation(() => ({
    site: {
      siteMetadata: {
        title: 'title',
        description: 'description',
        author: 'Kyle Pfromer',
      },
    },
  })),
  navigate: jest.fn().mockResolvedValue(undefined),
}));
