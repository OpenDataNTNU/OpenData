import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import { Template } from '../../sharedComponents/Template';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 400px;
`;

const H2 = styled.h2`
  font-size: 3em;
  text-align: center;
  margin: 0px;
`;

const P = styled.p`
  color: rgb(138, 138, 138);
`;

const Button = styled.button`
  margin-top: 15px;
  background-color: rgb(26, 170, 85);
  color: rgb(255, 255, 255);
  border: 1px solid rgb(22, 143, 72);
  border-width: 1px;
  border-style: solid;
  border-image: initial;
  padding: 12px 20px;
  border-radius: 3px;
  font-size: 1em;
`;

const Error404 = () => {
  // History object from react router dom
  const history = useHistory();

  // Function to go back to the last page that didnt give a 404 error
  const goBack = () => {
    history.goBack();
  };

  return (
    <Template>
      <Wrapper>
        <Content>
          <H2>
            OOPS!
          </H2>
          <P>
            Error 404: Page &apos;
            { history.location.pathname }
            &apos; Was Not Found
          </P>
          <Button onClick={goBack}>
            Go Back
          </Button>
        </Content>
      </Wrapper>
    </Template>
  );
};

export {
  Error404,
};
