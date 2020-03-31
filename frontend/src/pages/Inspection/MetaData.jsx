import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { ArrowRightS } from 'styled-icons/remix-fill/ArrowRightS';
import { useSelector, useDispatch } from 'react-redux';

import { alertActions } from '../../state/actions/alert';
import { ReleaseStateLabel } from '../../sharedComponents/Metadata/ReleaseStateLabel';
import { MetadataToolbar } from './MetadataToolbar';
import { MetadataURL } from '../../sharedComponents/Metadata/MetadataURL';
import { AddSource } from './AddSource';

const Wrapper = styled.div`
  max-width: 50rem;
  padding: 0 0.5rem;
`;
const MetadataCard = styled.div`
  background-color: white;
  border-radius: 0.3rem;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  padding: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 20rem;
  min-width: 35rem;
`;
const MetadataHeader = styled.div`
  padding: 0.5rem;
`;
const MetadataContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const DateLine = styled.p`
  font-size: 0.8rem;
  color: dimgray;
`;

const Description = styled.p`
  font-size: 0.9rem;
  color: #353535;
`;

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9rem;
  padding: 0.1rem 0.7rem;
  display: inline-block;
  border-radius: 1rem;
  margin: 0.3rem;
`;
const ArrowRightStyled = styled(ArrowRightS)`
  height: 0.9rem;
  margin: 0 0.3rem;
  color: dimgray;
`;
const LocationWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.8rem 0;
`;
const LocationLink = styled(Link)`
  font-size: 0.9rem;
  line-height: 0.9rem;
  padding: 0;
  color: dimgray;
  &:hover {
    text-decoration: underline;
  }
`;

const SourceWrapper = styled.div`
  display: flex;
  flex-direction: row;
  & > *:first-child {
    flex: 1;
  }
`;

export const MetaData = ({ data, tags, removeDataSource }) => {
  const {
    uuid, municipalityName, metadataTypeName, dataSource,
    experiencePosts, releaseState, description,
  } = data;

  const [newDatasources, setNewDatasources] = useState([]);
  const dispatch = useDispatch();
  const userSelector = useSelector(({ user }) => user);
  const {
    municipalityName: userMunicipality,
    token,
  } = userSelector.user || { municipalityName: null, token: null };

  const addSource = (source) => setNewDatasources([...newDatasources, source]);
  const removeSource = async (uuidToDelete) => {
    try {
      const res = await fetch('/api/Metadata/url', {
        method: 'DELETE',
        body: JSON.stringify({
          dataSourceUuid: uuidToDelete,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      const { ok, status } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      removeDataSource(uuidToDelete);
      setNewDatasources(newDatasources.filter((source) => source.uuid !== uuidToDelete));
    } catch (error) {
      dispatch(alertActions.error('Failed to delete the source'));
    }
  };

  return (
    <Wrapper>
      <LocationWrapper>
        <LocationLink to={`/municipalities/${municipalityName}`}>{municipalityName}</LocationLink>
        <ArrowRightStyled />
        <LocationLink to={`/dataType/${metadataTypeUuid}`}>{metadataTypeName}</LocationLink>
      </LocationWrapper>
      <MetadataCard>
        <MetadataHeader>
          <ReleaseStateLabel releaseState={releaseState} />
          <DateLine>
            Published
            {` ${date}`}
          </DateLine>
        </MetadataHeader>
        <MetadataContent>
          <p>{description}</p>
          <MetadataURL url={url} formatName={formatName} inspection />
          <h3>This data set is available in the following places:</h3>
          {dataSource.map(({ uuid: sourceUuid, url, dataFormat }) => (
            <SourceWrapper key={sourceUuid}>
              <MetadataURL url={url} formatName={dataFormat.name} inspection />
              {municipalityName === userMunicipality
                ? <button type="button" onClick={() => removeSource(sourceUuid)}>Delete</button>
                : null}
            </SourceWrapper>
          ))}
          {municipalityName === userMunicipality
            ? (
              <>
                {newDatasources.map(({ uuid: sourceUuid, url, dataFormat }) => (
                  <SourceWrapper key={sourceUuid}>
                    <MetadataURL url={url} formatName={dataFormat.name} inspection />
                    <button type="button" onClick={() => removeSource(sourceUuid)}>Delete</button>
                  </SourceWrapper>
                ))}
                <AddSource addSource={addSource} uuid={uuid} />
              </>
            )
            : null}
        </MetadataContent>
        <MetadataToolbar
          uuid={uuid}
          experiencePosts={experiencePosts}
          municipalityName={municipalityName}
        />
      </MetadataCard>
    </Wrapper>
  );
};

MetaData.propTypes = {
  data: PropTypes.shape({
    municipalityName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    experiencePosts: PropTypes.arrayOf(PropTypes.shape({
      experiencePostUuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })),
    uuid: PropTypes.string,
    dataSource: PropTypes.arrayOf(
      PropTypes.shape({
        uuid: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        dataFormat: PropTypes.shape({
          name: PropTypes.string.isRequired,
          description: PropTypes.string.isRequired,
          documentationUrl: PropTypes.string.isRequired,
        }),
        startDate: PropTypes.string,
        endDate: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  removeDataSource: PropTypes.func.isRequired,
};
