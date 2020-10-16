import React from 'react';
import { Redirect } from '@reach/router';
import { useLoginTokenQuery } from '../../generated/types-and-hooks';

export const PrivateRoute: React.FC<{ component: any }> = ({
  component: Component
}) => {
  const { data } = useLoginTokenQuery();
  if (
    (typeof window !== 'undefined' &&
      localStorage.getItem('loggedIn') === 'true') ||
    !!data?.token
  ) {
    return <Component />;
  }
  return <Redirect to="/login" />;
};
