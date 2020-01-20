import React from 'react';
import styled from 'styled-components';
import { GlobalStyle } from './global-styles';
import { Router } from './router';

const Wrapper = styled.div`
  text-align: center;
`

function App() {
  return (
    <React.Fragment>
      <Wrapper>
        <Router />
      </Wrapper>
      <GlobalStyle />
    </React.Fragment>
  );
}

export default App;
