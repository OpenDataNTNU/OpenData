import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  max-width: 50em;
`;

const Heading = styled.h1`

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
  background-color:
  #eeeeee;
  color:
  #595959;
  font-size: 0.9em;
  padding: 0.1em 0.7em;
  display: inline-block;
  border-radius: 1em;
  margin: 0.3em;
`;

export const MetaData = (props) => {
  const { data, id } = props;
  const date = '20-09-2019';
  const {
    municipality, format, url, tags,
  } = data;
  return (
    <Wrapper>
      <Heading>
        Showing metadata about dataset
        {` ${id}`}
      </Heading>
      <DateLine>
        Published
        {` ${date}`}
      </DateLine>
      <Description>
        This data was posted by
        {` ${municipality}`}
        , and is available in
        {' '}
        {format}
        -format on
        {' '}
        <a href={url}>{url}</a>
      </Description>
      <div>
        {tags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
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
