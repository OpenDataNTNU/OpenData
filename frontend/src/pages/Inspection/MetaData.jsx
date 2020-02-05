import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 50em;
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
  const { data, id } = props;
  const date = '20-09-2019';
  const {
    municipality, format, url, tags,
  } = data;
  return (
    <Wrapper>
      <h2>
        Showing metadata about dataset
        {` ${id}`}
      </h2>
      <DateLine>
        Published
        {` ${date}`}
      </DateLine>
      <Description>
        This data was posted by
        {` ${municipality}`}
      </Description>
      <div>
        {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
      </div>
      <div>
        <Source href={url} >
          {`[${url}]`}
          <FileFormat>
            <p>
              {format}
            </p>
          </FileFormat>
        </Source>
      </div>
    </Wrapper>
  );
};

MetaData.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.shape({
    municipality: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
