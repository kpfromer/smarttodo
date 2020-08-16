import React from 'react';
import { Box } from 'rebass';
import { Header } from './header';

export const Layout: React.FC = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box mt={3} as="main" variant="container" mx="auto">
        {children}
      </Box>
    </Box>
  );
};
