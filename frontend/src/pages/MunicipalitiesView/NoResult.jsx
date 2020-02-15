import React from 'react';
import styled from 'styled-components';

const NoResultContainer = styled.div`
  padding: 2em;
  display: flex;
  
  flex: 1;
  align-content: center;
  align-items: center;
  justify-content: center;
  justify-items: center;
  box-sizing: content-box;
  
  & > p {
    display: inline-block;
    color: lightgray;
    font-size: 5em;
    max-width: 40em;
    font-weight: bold;
    text-align: center;
  }
`;

const NoResult = (props) => {
  const { text } = props;
  return (
    <NoResultContainer>
      <p>{text}</p>
    </NoResultContainer>
  );
};

export {
  NoResult,

};
