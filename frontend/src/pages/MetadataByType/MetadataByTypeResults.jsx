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
  & > div {
    border-bottom: 0.1rem solid lightgray;
    padding: 0 0.5rem;
    & > h3 {
      margin: 0.2rem 0;
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
const Tag = styled.p`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9rem;
  padding: 0.1rem 0.7rem;
  display: inline-block;
  border-radius: 1rem;
  margin: 0.3rem;
`;
const NoTags = styled.p`
  color: dimgray;
  font-size: 0.8rem;
`;

const MetadataByTypeResults = ({ metadataTypeName }) => {
  const [metadataSet, setMetadataSet] = useState([]);
  const [fetchedMetadataSet, setFetchedMetadataSet] = useState([]);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState([]);
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
        const res = await fetch(`/api/MetadataType/${metadataTypeName}`);
        if (res.status === 200) {
          const {
            tags: receivedTags,
            description: receivedDescription,
            metadataList,
          } = await res.json();
          // setTags(receivedTags);
          setTags([receivedTags]);
          setDescription(receivedDescription);
          setFetchedMetadataSet(metadataList);
          setMetadataSet(metadataList);
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
        <div>
          <h3>{metadataTypeName}</h3>
          <p>{description}</p>
          { tags.length === 0 ? (
            <NoTags>No tags for this category.</NoTags>
          ) : tags.map((t) => <Tag>{t}</Tag>)}
        </div>
        <MetadataFilter onChange={handleFilterSelection} type="text" placeholder="Filter results" />
      </ResultsHeader>
      <ResultsContainer>
        { metadataSet.length === 0 ? (
          <NoResult text={`No results were found for ${metadataTypeName}.`} />
        ) : metadataSet.map((m) => (
          <SingleMetaDataResult key={m.uuid} metadata={m} />
        ))}
      </ResultsContainer>
    </CategoriesContainer>
  );
};

MetadataByTypeResults.propTypes = {
  metadataTypeName: PropTypes.string.isRequired,
};

export {
  MetadataByTypeResults,
};
