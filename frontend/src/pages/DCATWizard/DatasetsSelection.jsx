import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  flex: 1;
`;

const DatasetsSelection = ({ datasets }) => {
  return(
    <Wrapper>
      {
        datasets
      }
    </Wrapper>
  )
}

DatasetsSelection.propTypes = {
  datasets: PropTypes.arrayOf(PropTypes.string)
}

export {
  DatasetsSelection,
};
