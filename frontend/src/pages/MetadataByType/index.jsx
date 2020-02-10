import React from 'react';
import PropTypes from 'prop-types';

import { Template } from '../../sharedComponents/Template';
import { MetadataByTypeBody } from './MetadataByTypeBody';

export const MetadataByType = (props) => {
  const { match: { params: { name } } } = props;
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
