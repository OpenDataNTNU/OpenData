import React from 'react';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';

const Background = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  margin: 2em auto 0;
  flex-direction: column;
  max-width: 50em;
  align-items: flex-start;
  background-color: #eeeeee;
  padding: 0.5rem;
  box-sizing: border-box;
`;

const Wrapper = styled.div`
  max-width: 40em;
  border-radius: 0.3rem;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-sizing: border-box;
  margin: 0 auto;
  background-color: white;
  padding: 1.0rem;
  &>p {
    margin: 1rem 0;
  }
`;
const Heading = styled.h2`
  align-self: center;
  margin: 0.3rem 0 0.8rem 0;
`;

export const About = () => (
  <Template>
    <Background>
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
          Additionally, one of the biggest hurdles for municipalities wanting to release their data
          is the lack of experience/resources. By allowing easy information sharing between
          municipalities, OpenData aims to make it easy for municipalities to learn from
          early adopters, lowering the barrier for release of data.
        </p>
        <p>
          By solving these two problems,
          OpenData aims to act as an accellerator for release of open data in Norway.
        </p>
      </Wrapper>
    </Background>
  </Template>
);
