import React from 'react';
import styled from 'styled-components';
import { Template } from '../../sharedComponents/Template';
import { MyDataBody } from './MyDataBody';

const Background = styled.div`
  width: 100%;
  flex: 1;
  background-color: #eeeeee;
  padding: 0.5rem;
  box-sizing: border-box;
`;

export const MyData = () => (
  <Template>
    <Background>
      <MyDataBody />
    </Background>
  </Template>
);
