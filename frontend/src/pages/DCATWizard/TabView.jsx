import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
`;

const Head = styled.div`
  display: flex;
  min-height: 48px;
  width: 100%;
  flex-direction: row;
  background-color: #212121;
  color: #ffffff;
`;

const Tab = styled.div`
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  min-width: 160px;
  flex: ${(props) => props.flex};
  color: ${(props) => (props.active ? '#90caf9' : null)};
  background-color: ${(props) => (props.disabled ? '#262525' : null)};
  border-bottom: ${(props) => (props.active ? 'solid 3px #90caf9' : null)};
  justify-content: center;
  align-items: center;
  display: flex;

  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none;   /* Safari */
  -khtml-user-select: none;    /* Konqueror HTML */
  -moz-user-select: none;      /* Firefox */
  -ms-user-select: none;       /* Internet Explorer/Edge */
  user-select: none;           /* Non-prefixed version, currently supported by Chrome and Opera */
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`;

const fadeIn2 = keyframes`
  from {
    opacity: Calc(0);
  }

  to {
    opacity: 1;
  }
`;

const Views = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${(props) => (props.force ? fadeIn : fadeIn2)} 1s ease-in;
  padding: 10px;
`;

const TabView = ({
  children, tabs, disabledTabs,
}) => {
  // State
  const [currentView, setCurrentView] = useState(0);

  const forward = () => {
    if (currentView < tabs.length - 1 && !disabledTabs[currentView + 1]) {
      setCurrentView(currentView + 1);
    }
  };

  const backward = () => {
    if (currentView !== 0 && !disabledTabs[currentView - 1]) {
      setCurrentView(currentView - 1);
    }
  };

  return (
    <Container>
      <Head>
        <Tab flex="10" onClick={backward} disabled={currentView === 0 ? true : disabledTabs[currentView - 1]}>
          {
            currentView === 0
              ? ''
              : tabs[currentView - 1]
          }
        </Tab>
        <Tab flex="11" active>
          {
            tabs[currentView]
          }
        </Tab>
        <Tab flex="10" onClick={forward} disabled={currentView === tabs.length ? true : disabledTabs[currentView + 1]}>
          {
            currentView === tabs.length
              ? ''
              : tabs[currentView + 1]
          }
        </Tab>
      </Head>
      <Views force={currentView % 2 === 0}>
        {
            children[currentView]
          }
      </Views>
    </Container>
  );
};

TabView.propTypes = {
  tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  disabledTabs: PropTypes.arrayOf(PropTypes.bool.isRequired).isRequired,
};

export {
  TabView,
};
