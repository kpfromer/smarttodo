import React from 'react';
import { Box, Flex, Heading } from 'rebass';
import { logout } from '../../utils/auth';
import { useIsLoggedIn } from '../../utils/hooks/use-is-logged-in';
import { Link } from '../misc/link';

export const Header: React.FC = () => {
  const loggedIn = useIsLoggedIn();

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
              <Box variant="nav" onClick={logout} sx={{ cursor: 'pointer' }}>
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
