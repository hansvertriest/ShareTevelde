import React from 'react';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';

import { HomePage, ProfileConfig, SignUp, SignIn, NewPost, Profile, Post } from './pages';
import { PageLayout, SignUpInLayout } from './layouts';
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
              <RouteWithLayout exact path={Routes.NEWPOST} component={NewPost} layout={PageLayout} />
              <RouteWithLayout exact path={Routes.PROFILE} component={Profile} layout={PageLayout} />
              <RouteWithLayout exact path={Routes.POST} component={Post} layout={PageLayout} />
              <RouteWithLayout exact path={Routes.AUTH_SIGNUP} component={SignUp} layout={SignUpInLayout} />
              <RouteWithLayout exact path={Routes.AUTH_SIGNIN} component={SignIn} layout={SignUpInLayout} />
              <Redirect from={Routes.HOME} to={Routes.LANDING} />
            </Switch>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
