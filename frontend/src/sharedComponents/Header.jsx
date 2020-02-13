import React, { useEffect, useState } from 'react';
import { Link as ReactLink, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Dropdown } from './Dropdown';

const HeaderHTML = styled.header`
  padding: 0 1em 0 2em;
  color: white;
  background-color: black;
  display: flex;
  align-items: center;

  @media screen and (max-width: 600px) {
    padding: 0 1em;
    justify-content: space-between;
  }
`;

const Nav = styled.nav`
  height: 100%;
  margin-left: 1em;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

const HeaderLink = styled(ReactLink)`
  padding: 0 0.5em;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
`;

const NavInternalLink = styled(ReactLink)`
  padding: 1em;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &:last-child {
    margin-left: auto;
  }
`;

const NavExternalLink = styled.a`
  padding: 1em;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;

  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }

  &:last-child {
    margin-left: auto;
  }
`;

const Header = () => {
  // Redux state
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;

  // React-router-dom
  const history = useHistory();

  // State
  const [width, setWidth] = useState(window.innerWidth);

  // Update width state
  const updateWindowDimensions = () => {
    setWidth(window.innerWidth);
  };

  // Constructor and destructor
  useEffect(() => {
    // Update window dimensions
    updateWindowDimensions();
    // Add resize eventlinstener to window
    window.addEventListener('resize', updateWindowDimensions);

    // Remove eventlistener at unmount
    return () => {
      window.removeEventListener('resize', updateWindowDimensions);
    };
  }, []);

  // Dropdown component callback
  const onDropdownClick = (title) => {
    // Switch the argument title
    // As described in the dropdown component, the title will be the title
    // supplied with the the list item object
    switch (title) {
      case 'Source Code': {
        window.location = 'https://github.com/OpenDataNTNU/OpenData';
        break;
      }
      case 'Docs': {
        history.push('/docs');
        break;
      }
      case 'About': {
        history.push('/about');
        break;
      }
      case 'Sign in': {
        history.push('/login');
        break;
      }
      case 'Logout': {
        history.push('/logout');
        break;
      }
      default: {
        break;
      }
    }
  };

  return (
    <HeaderHTML>
      <HeaderLink to="/">
        <h1>OpenData</h1>
      </HeaderLink>
      {
        // Show normal nav on widht over 600
        // Else show responsive dropdown
        width > 600
          ? (
            <Nav>
              <NavExternalLink href="https://github.com/OpenDataNTNU/OpenData">
                <p>Source Code</p>
              </NavExternalLink>
              <NavInternalLink to="/docs">
                <p>Docs</p>
              </NavInternalLink>
              <NavInternalLink to="/about">
                <p>About</p>
              </NavInternalLink>
              <NavInternalLink to={user && user.mail ? '/logout' : '/login'}>
                <p>{user && user.mail ? 'Logout' : 'Sign in'}</p>
              </NavInternalLink>
            </Nav>
          )
          : (
            <Dropdown
              title="Navigation"
              onItemClick={onDropdownClick}
              list={[
                { id: 'Source Code', title: 'Source Code' },
                { id: 'Docs', title: 'Docs' },
                { id: 'About', title: 'About' },
                { id: user && user.mail ? 'Logout' : 'Sign in', title: user && user.mail ? 'Logout' : 'Sign in' },
              ]}
            />
          )
      }
    </HeaderHTML>
  );
};

export {
  Header,
};
