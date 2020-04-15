import React from 'react';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  margin: 2em auto 0;
  flex-direction: column;
  max-width: 50em;
  align-items: flex-start;
`;

const Heading = styled.h2`
  align-self: center;
`;

export const About = () => (
  <Template>
    <Wrapper>
      <Heading>What is OpenData?</Heading>
      <p>
        OpenData is a proof of concept website developed as a bachelor project.
        The project was developed by 7 students at the Norwegian University of Science and
        Technology, spring 2020, in collaboration with Sintef, who owns the project.
      </p>
      <p>
        One of the biggest selling points of open data is that people and businesses can use it to
        make decisions.
        However, many datasets are useless when they don
        {'\''}
        t cover most of the country.
      </p>
      <p>
        Additionally, one of the biggest hurdles for municipalities wanting to release their data is
        the lack of experience/resources. By allowing easy information sharing between
        municipalities, OpenData aims to make it easy for municipalities to learn from
        early adopters, lowering the barrier for release of data.
      </p>
      <p>
        By solving these two problems,
        OpenData aims to act as an accellerator for release of open data in Norway.
      </p>
    </Wrapper>
  </Template>
);
