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

  @media screen and (max-width: 650px) {
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

const Header = () => {
  // Redux state
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;
  const role = user ? user.userType : null;

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
      case 'Home': {
        history.push('/');
        break;
      }
      case 'Search by municipality': {
        history.push('/municipalities');
        break;
      }
      case 'Search by category': {
        history.push('/dataType');
        break;
      }
      case 'Submit data': {
        history.push('/sendData');
        break;
      }
      case 'My data': {
        history.push('/myData');
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
      case 'Search': {
        history.push('/search');
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
        width > 650
          ? (
            <Nav>
              <NavInternalLink to="/municipalities">
                <p>Search by municipality</p>
              </NavInternalLink>
              <NavInternalLink to="/search">
                <p>Search</p>
              </NavInternalLink>
              {
                role === 1
                  ? <NavInternalLink to="/sendData">Submit data</NavInternalLink>
                  : null
              }
              {
                role === 1
                  ? <NavInternalLink to="/myData">My data</NavInternalLink>
                  : null
              }
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
                { id: 'Home', title: 'Home' },
                { id: 'Search by municipality', title: 'Search by municipality' },
                { id: 'Search', title: 'Search' },
                ...role === 1 ? [{ id: 'Submit data', title: 'Submit data' },
                  { id: 'My data', title: 'My data' }] : [],
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
