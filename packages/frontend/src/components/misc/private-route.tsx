import React from 'react';
import { Redirect } from '@reach/router';
import { useIsLoggedIn } from '../../utils/hooks/use-is-logged-in';

export const PrivateRoute: React.FC<{ component: any }> = ({ component: Component }) => {
  const isLoggedIn = useIsLoggedIn();
  if (isLoggedIn) {
    return <Component />;
  }
  return <Redirect to="/login" />;
};
