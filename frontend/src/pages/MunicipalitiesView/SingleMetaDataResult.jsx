import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const SingleMetaDataResultContainer = styled.div`
  margin: 0.5em;
  border: solid 0.2em #f0f0f0;
  border-radius: 0.2em;
  padding: 0;
  display: flex;
  flexdirection: row;
`;
const MetaDataContent = styled.div`
  padding: 0.5em;
  flex: 1;
  & > h3 {
    margin: 0.2em 0;
  }
`;
const MetaDataRating = styled.div`
  background-color: #f0f0f0;
  width: 10em;
`;
const URLWrapper = styled.a`
  display: flex;
  background-color: #d8e3ff;
  border-radius: 0.1em;
  font-size: 1.0em;
  color: #434faf;
  
`;
const URL = styled.p`
  font-size: inherit;
  flex: 1;
  margin: 0.2em;
  padding: 0 0.7em;
`;
const DataFormat = styled.p`
  padding: 0.1em 1em;
  background-color: white;
  border-radius: 0.4em;
  margin: 0.2em 0.2em 0.2em 0.2em;
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
        <h3>Name of data</h3>
        <p>{description}</p>
        <URLWrapper href={url}>
          <URL>{url}</URL>
          <DataFormat>{formatName}</DataFormat>
        </URLWrapper>

      </MetaDataContent>
      <MetaDataRating>
        <p>Something</p>
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
