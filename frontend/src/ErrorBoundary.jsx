import React from 'react';
import PropTypes from 'prop-types';

import styled from 'styled-components';

const Wrapper = styled.div`
  height: Calc(100vh - 16px);
  width: Calc(100vw - 16px);
  flex-direction: column;
  display: flex;
`;

const Content = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
`;

const Info = styled.div`
  max-width:40em;
  padding: 1em;
  margin: 1em 0;
  background-color: white;
  border: solid 1px #f0f0f0;
  border-radius: 0.2em;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 0.0625em 0.125em;
`;

const ResetButton = styled.button`
  background-color: #ffc5ca;
  color: #a42126;
  border: solid 0.1em #a42126;
  padding: 0.3em;
  font-size:1.1em;
  border-radius: 0.3em;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 0 0 1em 0;
  cursor: pointer;
  transition: 0.2s ease;

  &:hover {
    color: white;
    background-color: #a42126;
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch() {
    // Display fallback UI
    this.setState({ hasError: true });
  }

  render() {
    const resetState = () => {
      // Clear redux state and reload application
      localStorage.clear();
      window.location.href = '/';
    };

    const { hasError } = this.state;
    const { children } = this.props;
    return (
      hasError
        ? (
          <Wrapper>
            <Content>
              <Info>
                <h1>An error has occurred.</h1>
                <p>
                  If this is the first time you see this page, please refresh.&nbsp;
                  Otherwise, reset the App by clicking the button bellow.
                </p>
                <ResetButton onClick={resetState}>Hard reset</ResetButton>
              </Info>
            </Content>
          </Wrapper>
        )
        : children
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export {
  ErrorBoundary,
};
