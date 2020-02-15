import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { NoResult } from './NoResult';
import { SingleMetaDataResult } from './SingleMetaDataResult';

const MunicipalityCategoriesContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ResultsContainer = styled.div`
  flex: 1;
`;

const MunicipalityMetadataResults = (props) => {
  const { municipalityName } = props;
  const [metaDataSet, setMetadataSet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      const res = await fetch('/api/Metadata');
      // TODO: Filter this result within API, not frontend!
      const receivedMetadataSet = await res.json();
      const filteredResult = receivedMetadataSet.filter((m) => (
        m.municipalityName.toLowerCase() === municipalityName.toLowerCase()
      ));
      if (receivedMetadataSet) {
        setMetadataSet(filteredResult);
      }
      setLoading(false);
    };
    internal();
  }, [municipalityName]);


  if (loading) {
    return (
      <MunicipalityCategoriesContainer>
        <h1>{municipalityName}</h1>
        <NoResult text="Loading..." />
      </MunicipalityCategoriesContainer>
    );
  }
  return (
    <MunicipalityCategoriesContainer>
      <h1>{municipalityName}</h1>
      <ResultsContainer>
        { metaDataSet.length === 0 ? (
          <NoResult text={`No results were found for ${municipalityName}.`} />
        )
          : metaDataSet.map((m) => (
            <SingleMetaDataResult key={m.uuid} metadata={m} />
          ))}
      </ResultsContainer>
    </MunicipalityCategoriesContainer>
  );
};

MunicipalityMetadataResults.propTypes = {
  municipalityName: PropTypes.string.isRequired,

};

export {
  MunicipalityMetadataResults,

};
