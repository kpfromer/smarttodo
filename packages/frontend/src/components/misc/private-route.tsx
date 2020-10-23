import React from 'react';
import { useLoginTokenQuery } from '../../generated/types-and-hooks';
import { Redirect, Route, RouteProps } from 'react-router';
import { routes } from '../../routes';

export const PrivateRoute: React.FC<RouteProps> = ({ children, ...props }) => {
  const { data } = useLoginTokenQuery();
  const loggedIn = localStorage.getItem('loggedIn') === 'true' || !!data?.token;

  return (
    <Route {...props}>
      {loggedIn ? children : <Redirect to={routes.login} />}
    </Route>
  );
  // if (localStorage.getItem('loggedIn') === 'true' || !!data?.token) {
  //   return <Route {...props}>{children}</Route>;
  // }
  // return <Redirect to={routes.login} />;
};

// import React from 'react';
// import { Redirect } from 'react-router';
// import { useLoginTokenQuery } from '../../generated/types-and-hooks';

// export const PrivateRoute: React.FC<{ component: any }> = ({
//   component: Component
// }) => {
//   const { data } = useLoginTokenQuery();
//   if (localStorage.getItem('loggedIn') === 'true' || !!data?.token) {
//     return <Component />;
//   }
//   return <Redirect to="/login" />;
// };
