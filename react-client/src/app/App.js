import React from 'react';
import {BrowserRouter as Router, Redirect, Switch} from 'react-router-dom';

import { HomePage, ProfileConfig, SignUp, SignIn, NewPost, Profile, Post, NotFound, Course, Assignment, AdminMerge, GoogleCallback } from './pages';
import { PageLayout, SignUpInLayout, AdminLayout } from './layouts';
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
				<RouteWithLayout exact path={Routes.COURSE} component={Course} layout={PageLayout} />
				<RouteWithLayout exact path={Routes.ASSIGNMENT} component={Assignment} layout={PageLayout} />
				<RouteWithLayout exact path={Routes.POST} component={Post} layout={PageLayout} />
				<RouteWithLayout exact path={Routes.AUTH_SIGNUP} component={SignUp} layout={SignUpInLayout} />
				<RouteWithLayout exact path={Routes.AUTH_SIGNIN} component={SignIn} layout={SignUpInLayout} />
				{/* <RouteWithLayout exact path={Routes.ADMIN_DELETE} component={NotFound} layout={SignUpInLayout} /> */}
				<RouteWithLayout exact path={Routes.GOOGLE_CALLBACK} component={GoogleCallback} layout={SignUpInLayout} />
				<RouteWithLayout exact path={Routes.ADMIN_MERGE} component={AdminMerge} layout={AdminLayout} />
				<RouteWithLayout exact path={Routes.NOTFOUND} component={NotFound} layout={SignUpInLayout} />
				<Redirect from={Routes.HOME} to={Routes.LANDING} />
				<RouteWithLayout exact path={Routes.UNKNOWN} component={NotFound} layout={SignUpInLayout} />
            </Switch>
          </Router>
        </ApiProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
