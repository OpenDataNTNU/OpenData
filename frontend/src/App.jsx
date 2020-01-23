import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { GlobalStyle } from './global-styles';
import { Router, history } from './router';
import { alertActions } from './state/actions/alert';
import { Alert } from './sharedComponents/Alert';

const Wrapper = styled.div`
  text-align: center;
`;

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
      <Wrapper>
        {
          alert && alert.type
            ? <Alert alert={alert} removeToast={removeAlert} />
            : null
        }
        <Router />
      </Wrapper>
      <GlobalStyle />
    </>
  );
}

export default App;
