import React from 'react';
import logo from '../../assets/logo.svg';
import styled from 'styled-components';
import { keyframes } from "styled-components";

const AppLogoSpin = keyframes`
from {
  transform: rotate(0deg);
}
to {
  transform: rotate(360deg);
}
`

const AppLogo = styled.img`
height: 40vmin;
pointer-events: none;

@media (prefers-reduced-motion: no-preference) {
  animation: ${AppLogoSpin} infinite 20s linear;
}
`

const AppHeader = styled.header`
background-color: #282c34;
min-height: 100vh;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
font-size: calc(10px + 2vmin);
color: white;
`

const AppLink = styled.a`
color: #61dafb;
`

const Splash = (props) => {
    return (
        <AppHeader>
            <AppLogo src={logo} alt="logo" />
            <p>
                Edit <code>src/App.js</code> and save to reload.
            </p>
            <AppLink
                href="https://reactjs.org"
                target="_blank"
                rel="noopener noreferrer"
            >
                Learn React
            </AppLink>
        </AppHeader>
    )
}

export {
    Splash
}