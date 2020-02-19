import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NoResult } from './NoResult';
import { SingleMetaDataResult } from './SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';

const MunicipalityCategoriesContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ResultsContainer = styled.div`
  flex: 1;
`;

const MunicipalityMetadataResults = ({ municipalityName }) => {
  const [metaDataSet, setMetadataSet] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        // TODO: Filter this result within API, not frontend!
        const res = await fetch('/api/Metadata');
        const receivedMetadataSet = await res.json();
        const filteredResult = receivedMetadataSet.filter((m) => (
          m.municipalityName.toLowerCase() === municipalityName.toLowerCase()
        ));
        if (receivedMetadataSet) {
          setMetadataSet(filteredResult);
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error(`Could not find the metadata for municipality ${municipalityName}`));
        } else {
          dispatch(alertActions.error('Failed to fetch metadata. Please try again later.'));
        }
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
        ) : metaDataSet.map((m) => (
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
