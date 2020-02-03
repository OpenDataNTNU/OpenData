import React from 'react';
import styled, { keyframes } from 'styled-components';

import { Template } from '../../sharedComponents/Template';
import logo from '../../assets/logo.svg';

const AppLogoSpin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const AppLogo = styled.img`
  height: 40vmin;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${AppLogoSpin} infinite 20s linear;
  }
`;

const SplashWrapper = styled.div`
  background-color: #282c34;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  text-align: center;
`;

const AppLink = styled.a`
  color: #61dafb;
`;

const Splash = () => { // eslint-disable-line arrow-body-style
  return (
    <Template>
      <SplashWrapper>
        <AppLogo src={logo} alt="logo" />
        <p>
          Edit
          <code>src/App.js</code>
          and save to reload.
        </p>
        <AppLink
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </AppLink>
      </SplashWrapper>
    </Template>
  );
};

export {
  Splash,
};
