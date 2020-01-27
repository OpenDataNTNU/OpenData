import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

// Private routes
import PrivateRoute from './PrivateRoute';

// Pages
import { Splash } from '../pages/Splash';
import { Error404 } from '../pages/Errors';

// The app's history object
const history = createBrowserHistory();

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Splash} />
        <PrivateRoute path="/private" component={() => <h1>Logged in</h1>} />
        <PrivateRoute path="/loggedOut" loggedOut component={() => <h1>Logged out</h1>} />
        <Route component={Error404} />
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
  history,
};
