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

  // Check if user has access
  const hasAccess = () => {
    // Check if role based authentication is sat and if the user has that role(s)
    if ((admin && role === 2) || (municipality && role === 1) || (standard && role === 0)) {
      return true;
    }
    // If a role based authentication is sat and the user dont have that role(s) then
    // he is not allowed to access
    if (admin || municipality || standard) {
      return false;
    }
    // If no role based authentication is sat then he is allowed to access
    return true;
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
