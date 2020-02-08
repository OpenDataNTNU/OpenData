import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


function PrivateRoute(props) {
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;
  const { component: Component, loggedOut, path } = props;
  const isLoggedIn = user && user.mail;

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

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  loggedOut: PropTypes.bool,
  path: PropTypes.string.isRequired,
};

PrivateRoute.defaultProps = {
  loggedOut: false,
};

export default PrivateRoute;
