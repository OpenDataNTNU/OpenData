import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1;
`;

export const ViewMetadataBody = (props) => {
  const { id } = props;
  // update this to match the relevant fields
  const [data, setData] = useState({ municipality: '', format: '' });

  useEffect(() => {
    const internal = async () => {
      const res = await fetch(`/api/data/${id}`);
      const { municipality, format } = await res.json();
      setData({ municipality, format });
    };
    internal();
  });

  const { municipality, format } = data;
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
        -format
      </h1>
    </Wrapper>
  );
};

ViewMetadataBody.propTypes = {
  id: PropTypes.string.isRequired,
};
