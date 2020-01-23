import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';


function PrivateRoute(props) {
  const userSelector = useSelector((state) => state.user);
  const { component: Component, loggedOut, path } = props;
  const isLoggedIn = userSelector && userSelector.email;

  const regularRender = <Route path={path} render={() => <Component />} />;
  // we may want to change the redirect between
  const redirect = <Route path={path} render={() => <Redirect to="/" />} />;
  // if route is exclusive to logged out users:
  if (loggedOut) {
    // render regularly if not logged in, redirect if logged in
    return !isLoggedIn ? regularRender : redirect;
  }
  // otherwise, render regularly if logged in and redirect otherwise
  return isLoggedIn ? regularRender : redirect;
}

export default PrivateRoute;
