import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

function PrivateRoute(props) {
  // const userSelector = useSelector(state => state.user)
  const { component: Component, ...rest } = props;
  const isLoggedIn = true;
  return isLoggedIn ? (
    <Route {...rest} render={()=><Component />} />
   ) : (
    <Route {...rest} render={()=><Redirect to="/" />} />
  );
}

export default PrivateRoute;
