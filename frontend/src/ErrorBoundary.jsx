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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  flex: 1;
`;

const ResetApp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ResetText = styled.span`
  color: #000000;
  opacity: 60%;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  margin: 0px;
`;

const Button = styled.button`
  min-width: 88px;
  height: 35px;
  background-color: #ff6961;
  border-color: #bf4f49;
  color: #ffffff;
  border-radius: 3px;
  margin-top: 10px;
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
                <Title>Something went wrong.</Title>
                <p>If this is the first time you see this page, please try to reload.</p>
                <div />
              </Info>
              <ResetApp>
                <ResetText>
                  If the problem is persistent, click here
                  {' '}
                  to restart the application (you might have to log in again).
                </ResetText>
                <Button onClick={resetState}>
                  Reset Application
                </Button>
              </ResetApp>
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
