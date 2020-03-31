import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const NoResultContainer = styled.div`
  padding: 2rem;
  display: flex;
  flex: 1;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  box-sizing: border-box;
  
  & > p {
    display: inline-block;
    color: lightgray;
    font-size: 5rem;
    font-weight: bold;
    text-align: center;
    line-break: anywhere;
    max-width: 100%;
  }
`;

const NoResult = ({ text }) => (
  <NoResultContainer>
    <p>{text}</p>
  </NoResultContainer>
);

NoResult.propTypes = {
  text: PropTypes.string.isRequired,
};

export {
  NoResult,
};
