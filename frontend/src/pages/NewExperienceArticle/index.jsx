import React from 'react';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';
import { Form } from './Form';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  max-width: 960px;
  margin: auto;
  box-sizing: border-box;

  @media screen and (max-width: 960px) {
    padding: 5px;
  }
`;

const NewExperienceArticle = () => (
  <Template>
    <Wrapper>
      <Form />
    </Wrapper>
  </Template>
);

export {
  NewExperienceArticle,
};
