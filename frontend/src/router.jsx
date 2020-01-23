import React from 'react';
import { Switch, Route, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history'; // eslint-disable-line import/no-extraneous-dependencies

// Pages
import { Splash } from './pages/Splash';

// The app's history object
const history = createBrowserHistory();

const RouterComponent = () => { // eslint-disable-line arrow-body-style
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/">
          <Splash />
        </Route>
      </Switch>
    </Router>
  );
};

export {
  RouterComponent as Router,
  history,
};
