import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Wrapper = styled.div`
  flex: 1;
`;

const CatalogsSelection = ({ catalogs }) => {
  return(
    <Wrapper>
      {
        catalogs
      }
    </Wrapper>
  )
}

CatalogsSelection.propTypes = {
  catalogs: PropTypes.arrayOf(PropTypes.string)
}

export {
  CatalogsSelection,
};
