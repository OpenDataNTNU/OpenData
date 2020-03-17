import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

const HeaderLinkWrapper = styled(Link)`
  padding: 1em;
  height: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  border-top: solid 0.4rem rgba(0, 0, 0, 0);
  border-bottom: ${(props) => (props.active
    ? 'solid 0.4rem #A19AE6'
    : 'solid 0.4rem rgba(0,0,0,0)'
  )};
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
  & > p {
    color: ${(props) => (props.active
    ? '#b3acff'
    : 'white'
  )};
  }
  &:last-child {
    margin-left: auto;
  }
`;

const HeaderLink = ({ text, to }) => {
  const { pathname } = useLocation();
  const isActive = to.startsWith(pathname);

  return (
    <HeaderLinkWrapper to={to} active={isActive}>
      <p>{text}</p>
    </HeaderLinkWrapper>
  );
};
HeaderLink.propTypes = {
  text: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export {
  HeaderLink,
};
