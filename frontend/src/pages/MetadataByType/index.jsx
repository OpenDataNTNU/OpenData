import React from 'react';
import { useParams } from 'react-router-dom';

import { Template } from '../../sharedComponents/Template';
import { MetadataByTypeBody } from './MetadataByTypeBody';

export const MetadataByType = () => {
  const { name } = useParams();
  return (
    <Template>
      <MetadataByTypeBody name={name} />
    </Template>
  );
};
