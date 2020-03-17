import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowRightS } from 'styled-icons/remix-fill/ArrowRightS';
import { useSelector } from 'react-redux';

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
const MetadataContent = styled.div`
  padding: 1rem;
  flex: 1;
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

export const MetaData = ({ data, tags }) => {
  const {
    uuid, municipalityName, metadataTypeName, experiencePostGuid,
    releaseState, description, dataSource,
  } = data;

  const [newDatasources, setNewDatasources] = useState([]);
  const addSource = (source) => setNewDatasources([...newDatasources, source]);

  const userSelector = useSelector(({ user }) => user);
  const { municipalityName: userMunicipality } = userSelector.user || { municipalityName: null };

  return (
    <Wrapper>
      <LocationWrapper>
        <LocationLink to={`/municipalities/${municipalityName}`}>{municipalityName}</LocationLink>
        <ArrowRightStyled />
        <LocationLink to={`/dataType/${metadataTypeName}`}>{metadataTypeName}</LocationLink>
      </LocationWrapper>
      <MetadataCard>
        <MetadataContent>
          <ReleaseStateLabel releaseState={releaseState} />
          <Description>
            {description}
          </Description>
          <div>
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <h3>This data set is available in the following places:</h3>
          {dataSource.map(({ uuid: sourceUuid, url, dataFormat }) => (
            <MetadataURL key={sourceUuid} url={url} formatName={dataFormat.name} inspection />
          ))}
          {newDatasources.map(({ uuid: sourceUuid, url, dataFormat }) => (
            <MetadataURL key={sourceUuid} url={url} formatName={dataFormat.name} inspection />
          ))}
          {
            municipalityName === userMunicipality
              ? <AddSource addSource={addSource} uuid={uuid} />
              : null
          }
        </MetadataContent>
        <MetadataToolbar
          uuid={uuid}
          experiencePostGuid={experiencePostGuid}
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
    experiencePostGuid: PropTypes.string,
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
};
