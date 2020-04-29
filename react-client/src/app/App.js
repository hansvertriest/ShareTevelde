import React from 'react';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';

import { HomePage, ProfileConfig, SignUp } from './pages';
import { PageLayout } from './layouts';
import { RouteWithLayout } from './utilities';
import * as Routes from './routes';
import { ApiProvider, AuthProvider } from './services';

import './app.scss';

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <ApiProvider>
          <Router basename='/'>
            <Switch>
              <RouteWithLayout exact path={Routes.LANDING} component={HomePage} layout={PageLayout} />
              <RouteWithLayout exact path={Routes.PROFILECONFIG} component={ProfileConfig} layout={PageLayout} />
              <RouteWithLayout exact path={Routes.AUTH_SIGNUP} component={SignUp} layout={PageLayout} />
              <Redirect from={Routes.HOME} to={Routes.LANDING} />
            </Switch>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
