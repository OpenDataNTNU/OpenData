import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';


function PrivateRoute(props) {
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;
  const role = user ? user.userType : null;
  const {
    component: Component, loggedOut, standard, municipality, admin, path,
  } = props;
  const isLoggedIn = user && user.mail;

  const regularRender = <Route path={path} render={() => <Component />} />;
  // we may want to change the redirect between
  const redirect = <Route path={path} render={() => <Redirect to="/" />} />;

  const hasAccess = () => {
    let access = true;
    if (admin && role === 2) { return true; }
    if (admin) { access = false; }
    if (municipality && role === 1) { return true; }
    if (municipality) { access = false; }
    if (standard && role === 0) { return true; }
    if (standard) { access = false; }
    return access;
  };

  // if route is exclusive to logged out users:
  if (loggedOut) {
    // render regularly if not logged in, redirect if logged in
    return !isLoggedIn ? regularRender : redirect;
  }
  // otherwise, render regularly if logged in and has acces, otherwise redirect
  return isLoggedIn && hasAccess() ? regularRender : redirect;
}

PrivateRoute.propTypes = {
  component: PropTypes.elementType.isRequired,
  loggedOut: PropTypes.bool,
  standard: PropTypes.bool,
  municipality: PropTypes.bool,
  admin: PropTypes.bool,
  path: PropTypes.string.isRequired,
};

PrivateRoute.defaultProps = {
  loggedOut: false,
  standard: false,
  municipality: false,
  admin: false,
};

export default PrivateRoute;
