import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 50em;
  background-color: white;
  max-width: 50em;
  border: solid 0.2em #e4e4e4;
  border-radius: 0.2em;
  padding: 0;
  margin: 0.5em;
`;

const DateLine = styled.p`
  font-size: 0.8em;
  color: dimgray;
`;

const Description = styled.p`
  font-size: 0.9em;
  color: #353535;
`;

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9em;
  padding: 0.1em 0.7em;
  display: inline-block;
  border-radius: 1em;
  margin: 0.3em;
`;

const Source = styled.a`
  margin: 0.5em;
  display: flex;
  flex-direction: row;
`;

const FileFormat = styled.div`
  background-color: #d8e3ff;
  margin-left: 0.4em;
  padding: 0 1em;
  color: #434faf;
`;

export const MetaData = (props) => {
  const { data, tags } = props;
  const date = '20-09-2019';
  const {
    uuid, municipalityName, formatName, url, metadataTypeName, description, experiencePostGuid,
  } = data;

  return (
    <Wrapper>
      <h2>
        Showing metadata about dataset
        {` ${metadataTypeName} from ${municipalityName}`}
      </h2>
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
      <div>
        <Source href={url}>
          {`[${url}]`}
          <FileFormat>
            <p>
              {formatName}
            </p>
          </FileFormat>
        </Source>
      </div>
      <hr />
      <div>
        {
          experiencePostGuid
            ? <Link to={`/articles/${experiencePostGuid}`}>Read Experience Article</Link>
            : <Link to={`/articles/new/${uuid}`}>Are you the owner of this data set? Write an experience article here</Link>
        }
      </div>
    </Wrapper>
  );
};

MetaData.defaultTypes = {
  uuid: '',
};

MetaData.propTypes = {
  data: PropTypes.shape({
    municipalityName: PropTypes.string.isRequired,
    formatName: PropTypes.string.isRequired,
    metadataTypeName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    experiencePostGuid: PropTypes.string.isRequired,
    uuid: PropTypes.string,
    description: PropTypes.string.isRequired,
  }).isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
};
