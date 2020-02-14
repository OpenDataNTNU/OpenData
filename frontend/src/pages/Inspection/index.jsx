import React from 'react';
import { useParams } from 'react-router-dom';

import { Template } from '../../sharedComponents/Template';
import { InspectionBody } from './InspectionBody';

export const Inspection = () => {
  const { id } = useParams();
  return (
    <Template>
      <InspectionBody id={id} />
    </Template>
  );
};
