import React from 'react';
import { Link as ReactLink } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const HeaderHTML = styled.header`
  padding: 0 1em 0 2em;
  color: white;
  background-color: black;
  display: flex;
`;

const Nav = styled.nav`
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

const NavLink = styled(ReactLink)`
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
  const user = useSelector((state) => state.user);

  return (
    <HeaderHTML>
      <HeaderLink to="/">
        <h1>OpenData</h1>
      </HeaderLink>
      <Nav>
        <NavLink to="#">
          <p>Source Code</p>
        </NavLink>
        <NavLink to="#">
          <p>Docs</p>
        </NavLink>
        <NavLink to="#">
          <p>About</p>
        </NavLink>
        <NavLink to={user && user.email ? '/account' : '/login'}>
          <p>{user && user.email ? 'Account' : 'Sign in'}</p>
        </NavLink>
      </Nav>
    </HeaderHTML>
  );
};

export {
  Header,
};
