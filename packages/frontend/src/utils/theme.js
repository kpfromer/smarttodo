import React from 'react';
import { ThemeProvider } from 'theme-ui';
import { client } from '../store/apollo';
import { ApolloProvider } from '@apollo/client';

const heading = {
  color: 'text',
  fontFamily: 'heading',
  lineHeight: 'heading',
  fontWeight: 'heading'
};

export const theme = {
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  fonts: {
    body: `'Open Sans', sans-serif`,
    heading: `'Poppins', sans-serif`
    // monospace: "Menlo, monospace",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700
  },
  lineHeights: {
    body: 1.5,
    heading: 1.125
  },
  colors: {
    text: '#fff',
    mutedText: '#ccc',
    background: '#323031',
    primary: '#177e89',
    secondary: '#db3a34',
    tertiary: '#ffc857',
    muted: '#f6f6f6'
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body'
    },
    h1: {
      ...heading,
      fontSize: 5
    },
    h2: {
      ...heading,
      fontSize: 4
    },
    h3: {
      ...heading,
      fontSize: 3
    },
    h4: {
      ...heading,
      fontSize: 2
    },
    h5: {
      ...heading,
      fontSize: 1
    },
    h6: {
      ...heading,
      fontSize: 0
    },
    p: {
      color: 'text',
      fontFamily: 'body',
      fontWeight: 'body',
      lineHeight: 'body'
    },
    a: {
      color: 'secondary',
      fontWeight: 'bold',
      textDecoration: 'none'
    },
    pre: {
      fontFamily: 'monospace',
      overflowX: 'auto',
      code: {
        color: 'inherit'
      }
    },
    code: {
      fontFamily: 'monospace',
      fontSize: 'inherit'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: 0
    },
    th: {
      textAlign: 'left',
      borderBottomStyle: 'solid'
    },
    td: {
      textAlign: 'left',
      borderBottomStyle: 'solid'
    },
    img: {
      maxWidth: '100%'
    }
  },
  shadows: {
    small: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    medium: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    large: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)',
    sidebar: '10px 0 20px 0 rgba(0,0,0,0.30);'
  },
  // custom user variants
  container: {
    px: 3,
    maxWidth: 1250,
    mx: 'auto'
  },
  // nav: {
  //   color: 'primary',
  //   textDecoration: 'none',
  //   textAlign: 'center',
  //   px: 2,
  //   fontWeight: 'bold',
  //   textTransform: 'uppercase',
  //   ':hover': {
  //     textDecoration: 'underline'
  //   }
  // },
  noStyle: {
    color: 'text',
    textDecoration: 'none',
    ':visited': {
      color: 'text'
    }
  },
  nav: {
    color: 'white',
    fontSize: 3,
    textDecoration: 'none'
  }
};

export const wrapRootElement = ({ element }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>{element}</ThemeProvider>
  </ApolloProvider>
);
