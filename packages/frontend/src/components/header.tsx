import React from 'react';
import { Flex, Box, Heading } from 'rebass';
import { Link } from './link';
import { useLoginTokenQuery } from '../generated/types-and-hooks';

export const Header: React.FC = () => {
  const { data } = useLoginTokenQuery();
  const loggedIn =
    (typeof window !== 'undefined' &&
      localStorage.getItem('loggedIn') === 'true') ||
    !!data?.token;

  return (
    <Box bg="primary" color="white">
      <Flex variant="container" py={3} alignItems="center">
        <Link to="/" color="white" sx={{ textDecoration: 'none' }}>
          <Heading fontSize={6}>Smarttodo</Heading>
        </Link>

        <Flex ml="auto" alignItems="center">
          {loggedIn ? (
            <Link variant="nav" to="/app/">
              Todo
            </Link>
          ) : (
            <>
              <Link variant="nav" to="/register" mr={3}>
                Register
              </Link>
              <Link variant="nav" to="/login" data-testid="loginHeader">
                Login
              </Link>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};
