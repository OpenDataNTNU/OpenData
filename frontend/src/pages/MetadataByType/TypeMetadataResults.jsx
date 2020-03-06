import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NoResult } from '../MetadataByMunicipality/NoResult';
import { SingleMetaDataResult } from './SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';

const CategoriesContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;
const ResultsContainer = styled.div`
  flex: 1;
`;
const ResultsHeader = styled.div`
  
`;
const TypeMetadataResults = ({ metadataTypeName }) => {
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
          m.metadataTypeName.toLowerCase() === metadataTypeName.toLowerCase()
        ));
        if (receivedMetadataSet) {
          setMetadataSet(filteredResult);
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error(`Could not find the metadata for category ${metadataTypeName}`));
        } else {
          dispatch(alertActions.error('Failed to fetch metadata. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, [metadataTypeName]);

  if (loading) {
    return (
      <CategoriesContainer>
        <ResultsHeader>
          <h1>{metadataTypeName}</h1>
        </ResultsHeader>
        <NoResult text="Loading..." />
      </CategoriesContainer>
    );
  }
  return (
    <CategoriesContainer>
      <ResultsHeader>
        <h1>{metadataTypeName}</h1>
      </ResultsHeader>
      <ResultsContainer>
        { metaDataSet.length === 0 ? (
          <NoResult text={`No results were found for ${metadataTypeName}.`} />
        ) : metaDataSet.map((m) => (
          <SingleMetaDataResult key={m.uuid} metadata={m} />
        ))}
      </ResultsContainer>
    </CategoriesContainer>
  );
};

TypeMetadataResults.propTypes = {
  metadataTypeName: PropTypes.string.isRequired,
};

export {
  TypeMetadataResults,
};
