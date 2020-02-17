import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

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
  return (
    <SubHeaderContainer>
      <LinkStyled to="/municipalities">Search by municipality</LinkStyled>
      <LinkStyled to="/viewData">Search by category</LinkStyled>
      <LinkStyled to="/submitData">Submit data</LinkStyled>
    </SubHeaderContainer>
  );
};

export {
  SubHeader,

};
