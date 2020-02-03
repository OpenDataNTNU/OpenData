import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 50em;
`;

export const MetaData = (props) => {
  const { data, id } = props;
  const { municipality, format, url } = data;
  return (
    <Wrapper>
      <h1>
        Showing metadata about dataset
        {' '}
        {id}
        .
        This data was posted by
        {' '}
        {municipality}
        , and is available in
        {' '}
        {format}
        -format on
        {' '}
        <a href={url}>{url}</a>
      </h1>
    </Wrapper>
  );
};

MetaData.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    municipality: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  }).isRequired,
};
