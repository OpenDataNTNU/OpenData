import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const SubHeaderContainer = styled.div`
  background-color: #f0f0f0;
  color: #272727;
  display: flex;
  padding: 0 2em;
`;
const LinkStyled = styled(Link)`
  color: inherit;
  display: block;
  font-size: 0.9em;
  padding: 0.7em;
  &:hover {
    background-color: #f7f7f7;
  }
`;

const SubHeader = () => {
  // Redux state
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;
  const role = user ? user.userType : null;

  return (
    <SubHeaderContainer>
      <LinkStyled to="/municipalities">Search by municipality</LinkStyled>
      <LinkStyled to="/">Search by category</LinkStyled>
      {
        role === 1
          ? <LinkStyled to="/sendData">Submit data</LinkStyled>
          : null
      }
    </SubHeaderContainer>
  );
};

export {
  SubHeader,

};
