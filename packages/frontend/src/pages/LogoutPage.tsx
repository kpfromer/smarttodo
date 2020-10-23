import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Layout } from '../components/layout/layout';
import { routes } from '../routes';
import { token } from '../store/cache';

export const LogoutPage: React.FC = () => {
  const history = useHistory();
  useEffect(() => {
    // TODO: backend logout
    token(undefined);
    localStorage.setItem('loggedIn', 'false');
    history.push(routes.home);
  }, [history]);
  return <Layout>Logging out!</Layout>;
};
