import React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './global-styles';
import { Router } from './router';

const AppWrapper = styled.div`
  text-align: center;
`

function App() {
  return (
    <React.Fragment>
      <AppWrapper>
        <Router />
      </AppWrapper>
      <GlobalStyle />
    </React.Fragment>
  );
}

export default App;
