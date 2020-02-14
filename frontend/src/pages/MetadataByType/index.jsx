import React from 'react';
import PropTypes from 'prop-types';
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

MetadataByType.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
