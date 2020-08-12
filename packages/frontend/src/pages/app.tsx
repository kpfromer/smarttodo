import React from 'react';
import { Router } from '@reach/router';
import { Layout } from '../components/layout';
import { PrivateRoute } from '../components/private-route';
import { Todo } from '../components/app/todo';

const App = () => {
  return (
    <Layout>
      <Router basepath="/app">
        <PrivateRoute path="/" component={Todo} />
      </Router>
    </Layout>
  );
};
export default App;
