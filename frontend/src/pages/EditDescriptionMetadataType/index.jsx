import React from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Template } from '../../sharedComponents/Template';
import { DescriptionEditBody } from './DescriptionEditBody';

const Background = styled.div`
  width: 100%;
  flex: 1;
  background-color: #eeeeee;
  padding: 0.5rem;
  box-sizing: border-box;
`;
export const EditDescriptionMetadataType = () => {
  const { id } = useParams();
  return (
    <Template>
      <Background>
        <DescriptionEditBody uuid={id} />
      </Background>
    </Template>
  );
};
