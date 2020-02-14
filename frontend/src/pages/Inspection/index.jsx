import React from 'react';
import PropTypes from 'prop-types';
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

Inspection.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
