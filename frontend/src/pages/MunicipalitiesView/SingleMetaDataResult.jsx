import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import chatIcon from '../../assets/ui/chat.svg';

const SingleMetaDataResultContainer = styled.div`
  margin: 0.5em;
  border: solid 0.2em #f0f0f0;
  border-radius: 0.5em;
  padding: 0;
  display: flex;
  flex-direction: row;
  background-color: #f3f3f3;
`;
const MetaDataContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0.3em;
  background-color: white;
  overflow: hidden;
`;
const MetaDataDescription = styled.div`
  flex: 1;
  padding: 0.5em;
`;
const MetaDataRating = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  padding: 0.4em;
  background-color: #f3f3f3;
`;
const CommentsIcon = styled.a`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  
  & > p {
    font-size: 0.8em;
    max-width: 6em;
    text-align: center;
  }
  
  & > img {
    max-width: 1.4em;
  }
`;
const URLWrapper = styled.a`
  display: flex;
  background-color: #d8e3ff;
  font-size: 0.9em;
  color: #434faf;
  margin: 0;
`;
const URL = styled.p`
  font-size: inherit;
  flex: 1;
  margin: 0.2em;
  padding: 0.5em 0.7em;
`;
const DataFormat = styled.p`
  padding: 0.5em 0.7em;
  background-color: white;
  border-radius: 0.4em;
  margin: 0.3em;
`;

const SingleMetaDataResult = (props) => {
  const {
    metadata: {
      uuid, formatName, url, description, releaseState, metaDataTypeName
    },
  } = props;

  return (
    <SingleMetaDataResultContainer>
      <MetaDataContent>
        <MetaDataDescription>
          <p>{description}</p>
        </MetaDataDescription>
        <URLWrapper href={url}>
          <URL>{url}</URL>
          <DataFormat>{formatName}</DataFormat>
        </URLWrapper>
      </MetaDataContent>
      <MetaDataRating>
        {/* eslint-disable-next-line no-irregular-whitespace */}
        {/* TODO: Correct route to single metadata page */}
        <CommentsIcon href={`URL-TO-METADATA-PAGE-${uuid}`}>
          <img src={chatIcon} alt="Feedback" />
          <p>[number] Comments</p>
        </CommentsIcon>
      </MetaDataRating>

    </SingleMetaDataResultContainer>
  );
};

SingleMetaDataResult.propTypes = {
  metadata: PropTypes.shape({
    uuid: PropTypes.string,
    formatName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    releaseState: PropTypes.number.isRequired,
  }).isRequired,
};

export {
  SingleMetaDataResult,

};
