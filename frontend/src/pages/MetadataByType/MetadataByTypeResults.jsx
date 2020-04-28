import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { NoResult } from '../MetadataByMunicipality/NoResult';
import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';
import { DescriptionEditButton } from '../EditDescriptionMetadataType/DescriptionEditButton';

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

const MetadataByTypeResults = ({ metadataTypeUuid }) => {
  const [metadataType, setMetadataType] = useState(null);
  const [metadataSet, setMetadataSet] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const handleFilterSelection = ({ target: { value } }) => {
    setMetadataSet(
      metadataType.metadataList.filter(
        (c) => c.description.toLowerCase().includes(value.toLowerCase()),
      ),
    );
  };

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/MetadataType/${metadataTypeUuid}`);
        if (res.status === 200) {
          const receivedMetadataType = await res.json();
          if (!receivedMetadataType.description) {
            receivedMetadataType.description = {
              content: 'No description',
            };
          }
          setMetadataType(receivedMetadataType);
          setMetadataSet(receivedMetadataType.metadataList);
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error(`Could not find the category ${metadataTypeUuid}`));
        } else {
          dispatch(alertActions.error('Failed to fetch metadata. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, [metadataTypeUuid]);

  if (loading) {
    return (
      <CategoriesContainer>
        <NoResult text="Loading..." />
      </CategoriesContainer>
    );
  }
  if (!metadataType) {
    return (
      <CategoriesContainer>
        <NoResult text={`No category found for ${metadataTypeUuid}`} />
      </CategoriesContainer>
    );
  }
  const { tags, description, name } = metadataType;
  return (
    <CategoriesContainer>
      <ResultsHeader>
        <div>
          <h3>{metadataType.name}</h3>
          <DescriptionEditButton uuid={metadataTypeUuid} />
          <p>{description.content}</p>
          { tags.length === 0 ? (
            <NoTags>No tags for this type.</NoTags>
          ) : tags.map(({ tagName }) => <Tag key={tagName}>{tagName}</Tag>)}
        </div>
        <MetadataFilter onChange={handleFilterSelection} type="text" placeholder="Filter results" />
      </ResultsHeader>
      <ResultsContainer>
        { metadataSet.length === 0 ? (
          <NoResult text={`No results were found for ${metadataTypeUuid}.`} />
        ) : metadataSet.map((m) => (
          <SingleMetaDataResult
            key={m.uuid}
            metadata={{ ...m, metadataTypeName: name }}
            showMunicipality
          />
        ))}
      </ResultsContainer>
    </CategoriesContainer>
  );
};

MetadataByTypeResults.propTypes = {
  metadataTypeUuid: PropTypes.string.isRequired,
};

export {
  MetadataByTypeResults,
};
