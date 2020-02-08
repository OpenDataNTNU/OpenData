import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    min-height: 100vh;
    height: 100vh;
    margin: 0;
    display: flex;
    flex-direction: column;
    font-family: 'Roboto', sans-serif;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  p {
    margin: 0.3em 0;
  }

  #root {
    height: inherit;
    min-height: inherit;
  }
`;

export {
  GlobalStyle,
};
