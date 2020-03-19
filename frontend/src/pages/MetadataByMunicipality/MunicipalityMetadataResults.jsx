import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NoResult } from './NoResult';
import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
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
const ResultsHeader = styled.div`
  & > div {
    border-bottom: 0.1rem solid lightgray;
    padding: 0 0.5rem;
    & > h3 {
      margin: 0.4rem 0;
    }
  }
`;

const MetadataFilter = styled.input`
  padding: 0.3rem;
  border-radius: 0.3rem;
  border: solid 0.1rem lightgrey;
  display: block;
  box-sizing: border-box;
  margin: 0.3rem;
  font-size: 1.0rem;
`;

const MunicipalityMetadataResults = ({ municipalityName }) => {
  const [metaDataSet, setMetadataSet] = useState([]);
  const [fetchedMetadataSet, setFetchedMetadataSet] = useState([]);
  const [loading, setLoading] = useState(true);
  // in order to memoize and avoid fetching the same thing too many times
  const [uuidToName, setUuidToName] = useState({});

  const dispatch = useDispatch();

  const handleFilterSelection = ({ target: { value } }) => {
    setMetadataSet(
      fetchedMetadataSet.filter(
        (c) => c.description.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        // TODO: Filter this result within API, not frontend!
        const res = await fetch('/api/Metadata');
        if (res.status === 200) {
          const receivedMetadataSet = await res.json();
          const filteredResult = receivedMetadataSet.filter((m) => (
            m.municipalityName.toLowerCase() === municipalityName.toLowerCase()
          ));
          setFetchedMetadataSet(filteredResult);
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

  useEffect(() => {
    const internal = async (i) => {
      const { metadataTypeUuid } = metaDataSet[i];
      if (!uuidToName[metadataTypeUuid]) {
        const newUuidToName = {};
        const res = await fetch(`/api/MetadataType/${metadataTypeUuid}`);
        const { name } = await res.json();
        newUuidToName[metadataTypeUuid] = name;
        setUuidToName((obj) => ({ ...newUuidToName, ...obj }));
      }
    };
    for (let i = 0; i < metaDataSet.length; i += 1) {
      internal(i);
    }
  }, [metaDataSet]);

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
      <ResultsHeader>
        <div>
          <h3>{municipalityName}</h3>
        </div>
        <MetadataFilter onChange={handleFilterSelection} type="text" placeholder="Filter results" />
      </ResultsHeader>
      <ResultsContainer>
        { metaDataSet.length === 0 ? (
          <NoResult text={`No results were found for ${municipalityName}.`} />
        ) : metaDataSet.map((m) => (
          <SingleMetaDataResult
            key={m.uuid}
            metadata={{ ...m, metadataTypeName: uuidToName[m.metadataTypeUuid] || '' }}
            showCategory
          />
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
