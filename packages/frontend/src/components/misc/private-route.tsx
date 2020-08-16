import React from 'react';
import { Redirect } from '@reach/router';
import { useLoginTokenQuery } from '../../generated/types-and-hooks';

export const PrivateRoute = ({ component: Component, location, ...rest }) => {
  const { data } = useLoginTokenQuery();
  if (
    (typeof window !== 'undefined' &&
      localStorage.getItem('loggedIn') === 'true') ||
    !!data?.token
  ) {
    return <Component {...rest} />;
  }
  return <Redirect to="/login" />;
};
