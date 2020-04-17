import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
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
  overflow: visible;
  min-height: 20rem;
  min-width: 15rem;
`;
const MetadataContent = styled.div`
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
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
export const MetaData = ({ data, removeDataSource }) => {
  const {
    uuid, municipalityName, metadataTypeUuid, dataSource,
    experiencePosts, releaseState, description,
  } = data;
  const [metadataTypeName, setMetadataTypeName] = useState('');
  const [newDatasources, setNewDatasources] = useState([]);
  const userSelector = useSelector(({ user }) => user);
  const {
    municipalityName: userMunicipality,
    token,
  } = userSelector.user || { municipalityName: null, token: null };
  const dispatch = useDispatch();

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

  useEffect(() => {
    const getMetadataTypeName = async () => {
      try {
        const res = await fetch(`/api/MetadataType/${metadataTypeUuid}`);
        if (res.status === 200) {
          const { name } = await res.json();
          setMetadataTypeName(name);
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not fetch metadata type name'));
        } else if (status === 401) {
          dispatch(alertActions.info('Not authorized to see metadata type name.'));
        } else {
          dispatch(alertActions.error('Failed to fetch metadata type name. Please try again later.'));
        }
      }
    };
    getMetadataTypeName();
  }, [metadataTypeUuid]);

  return (
    <Wrapper>
      <LocationWrapper>
        <LocationLink to={`/municipalities/${municipalityName}`}>{municipalityName}</LocationLink>
        <ArrowRightStyled />
        <LocationLink to={`/dataType/${metadataTypeUuid}`}>{metadataTypeName}</LocationLink>
      </LocationWrapper>
      <MetadataCard>
        <MetadataContent>
          <div>
            <ReleaseStateLabel releaseState={releaseState} />
            <p>{description}</p>
          </div>
          <h3>This data set has the following entries:</h3>
          {dataSource.map(({
            uuid: sourceUuid, url, dataFormat, startDate, endDate,
          }) => (
            <SourceWrapper key={sourceUuid}>
              <MetadataURL
                url={url}
                formatName={dataFormat.name}
                startDate={startDate}
                endDate={endDate}
                inspection
              />
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
    uuid: PropTypes.string,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    metadataTypeUuid: PropTypes.string.isRequired,
    municipalityName: PropTypes.string.isRequired,
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
    experiencePosts: PropTypes.arrayOf(PropTypes.shape({
      experiencePostUuid: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
    })),
  }).isRequired,
  removeDataSource: PropTypes.func.isRequired,
};
