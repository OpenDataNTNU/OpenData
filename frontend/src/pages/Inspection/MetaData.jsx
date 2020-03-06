import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { ArrowRightS } from 'styled-icons/remix-fill/ArrowRightS';
import { ReleaseStateLabel } from '../../sharedComponents/Metadata/ReleaseStateLabel';
import { MetadataToolbar } from './MetadataToolbar';
import { MetadataURL } from '../../sharedComponents/Metadata/MetadataURL';

const Wrapper = styled.div`
  max-width: 50rem;
  padding: 0 0.5rem;
`;
const MetadataCard = styled.div`
  background-color: white;
  border-radius: 0.3rem;
  padding: 0;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 20rem;
  min-width: 20em;
`;
const MetadataContent = styled.div`
  padding: 1rem;
  flex: 1;
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
  margin: 0 1.0rem;
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

export const MetaData = (props) => {
  const { data, tags } = props;
  const date = '20-09-2019';

  const {
    uuid, municipalityName, formatName, url, metadataTypeName, experiencePostGuid, releaseState, description, experiencePostGuid,
  } = data;

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
          <DateLine>
            Published
            {` ${date}`}
          </DateLine>
          <Description>
            {description}
          </Description>
          <div>
            {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
          </div>
          <MetadataURL url={url} formatName={formatName} inspection />
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
    formatName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
    experiencePostGuid: PropTypes.string,
    uuid: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};
