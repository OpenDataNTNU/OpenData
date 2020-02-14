import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { NoResult } from './NoResult';
import { SingleMetaDataResult } from './SingleMetaDataResult';

const MunicipalityCategoriesContainer = styled.div`
  height: 100%;
`;

const MunicipalityCategories = (props) => {
  const { municipalityName } = props;
  const [metaDataSet, setMetadataSet] = useState([]);

  useState(() => {
    const internal = async () => {
      const res = await fetch('/api/Metadata'); // TODO: Filter this result within API, not frontend!
      console.log(res);
      const receivedMetadataSet = await res.json();
      console.log(receivedMetadataSet);
      const filteredResult = receivedMetadataSet.filter((m) => (
        m.municipalityName.toLowerCase() === municipalityName.toLowerCase()
      ));
      if (receivedMetadataSet) {
        setMetadataSet(filteredResult);
      }
    };
    internal();
  }, []);

  return (
    <MunicipalityCategoriesContainer>
      { metaDataSet.length === 0 ? (
        <NoResult text="No result was found." />
      )
        : metaDataSet.map((m) => (
          <SingleMetaDataResult metadata={m} />
        ))}
    </MunicipalityCategoriesContainer>
  );
};

MunicipalityCategories.propTypes = {
  municipalityName: PropTypes.string.isRequired,

};

export {
  MunicipalityCategories,

};
