import React from 'react';
import { Flex, Box, Heading } from 'rebass';
import { Link } from '../misc/link';
import { useLoginTokenQuery } from '../../generated/types-and-hooks';
import { logout } from '../../utils/logout';

export const Header: React.FC = () => {
  const { data } = useLoginTokenQuery();
  const loggedIn =
    (typeof window !== 'undefined' && localStorage.getItem('loggedIn') === 'true') || !!data?.token;

  return (
    <Box bg="primary" color="white">
      <Flex variant="container" py={3} alignItems="center">
        <Link to="/" color="white" sx={{ textDecoration: 'none' }}>
          <Heading fontSize={6}>Smarttodo</Heading>
        </Link>

        <Flex ml="auto" alignItems="center">
          {loggedIn ? (
            <>
              <Link variant="nav" to="/app/" mr={3}>
                Todo
              </Link>
              <Box variant="nav" onClick={logout}>
                Logout
              </Box>
            </>
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
