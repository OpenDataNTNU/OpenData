import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { GlobalStyle } from './global-styles';
import { history } from './router/history';
import { Router } from './router/router';
import { alertActions } from './state/actions/alert';
import { Alert } from './sharedComponents/Alert';

function App() {
  // Redux dispatch
  const dispatch = useDispatch();

  // Global state
  const alert = useSelector((state) => state.alert);

  // callback to remove alert
  const removeAlert = () => {
    dispatch(alertActions.clear());
  };

  // Constructor
  useEffect(() => {
    // clear alert on location change
    history.listen(() => {
      removeAlert();
    });
  }, []);

  return (
    <>
      <>
        {
          alert && alert.type
            ? <Alert alert={alert} removeToast={removeAlert} />
            : null
        }
        <Router />
      </>
      <GlobalStyle />
    </>
  );
}

export default App;
