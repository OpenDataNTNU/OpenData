import React from 'react';
import PropTypes from 'prop-types';

import { Template } from '../../sharedComponents/Template';
import { ViewMetadataBody } from './ViewMetadataBody';

export const ViewMetadata = (props) => {
  console.log(props);
  const { match: { params: { id } } } = props;
  return (
    <Template>
      <ViewMetadataBody id={id} />
    </Template>
  );
};

ViewMetadata.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
