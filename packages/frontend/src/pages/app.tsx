import React from 'react';
import { Router } from '@reach/router';
import { PrivateRoute } from '../components/misc/private-route';
import { Todo } from '../components/app/todo';

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute path="/" component={Todo} />
    </Router>
  );
};
export default App;
