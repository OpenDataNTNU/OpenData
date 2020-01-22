import React, { useEffect } from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './global-styles';
import { Router } from './router';

import { useSelector, useDispatch } from 'react-redux';
import { history } from './router';
import { alertActions } from './state/actions/alert';
import { Alert } from './sharedComponents/Alert';

const Wrapper = styled.div`
  text-align: center;
`

function App() {
  // Redux dispatch
  const dispatch = useDispatch();

  // Global state
  const alert = useSelector(state => state.alert)

  useEffect(() => {
		// clear alert on location change
    history.listen((location, action) => {
        removeAlert();
    });
  }, [])

  // callback to remove alert
  const removeAlert = () => {
    dispatch(alertActions.clear());
  }

  return (
    <React.Fragment>
      <Wrapper>
        {
          alert && alert.type 
          ? 
            <Alert alert={alert} removeToast={removeAlert} /> 
          : 
            null
        }
        <Router />
      </Wrapper>
      <GlobalStyle />
    </React.Fragment>
  );
}

export default App;
