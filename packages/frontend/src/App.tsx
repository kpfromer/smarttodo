import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider } from 'theme-ui';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { client } from './store/apollo';
import { theme } from './utils/theme';
import { HomePage } from './pages/HomePage';
import { TodoPage } from './pages/TodoPage';
import { routes } from './routes';
import { PrivateRoute } from './components/misc/private-route';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { LogoutPage } from './pages/LogoutPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route exact path={routes.home}>
              <HomePage />
            </Route>

            <Route exact path={routes.login}>
              <LoginPage />
            </Route>

            <Route exact path={routes.logout}>
              <LogoutPage />
            </Route>

            <Route exact path={routes.register}>
              <RegisterPage />
            </Route>

            {/* Private */}

            <PrivateRoute path={`${routes.todos}/:projectId?`}>
              <TodoPage />
            </PrivateRoute>

            <PrivateRoute exact path={routes.settings}>
              <SettingsPage />
            </PrivateRoute>

            <Route>
              <NotFoundPage />
            </Route>
          </Switch>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
