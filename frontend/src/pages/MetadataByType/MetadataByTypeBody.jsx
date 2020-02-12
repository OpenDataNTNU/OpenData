import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9em;
  padding: 0.1em 0.7em;
  display: inline-block;
  border-radius: 1em;
  margin: 0.3em;
`;

export const MetadataByTypeBody = (props) => {
  const { name } = props;
  const [metadatas, setMetadatas] = useState([]);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');

  // get list of municipalities offering the metadata
  useEffect(() => {
    const internal = async () => {
      const res = await fetch(`/api/metadataType/${name}`);
      const {
        metadataList, tags: receivedTags, description: receivedDescription,
      } = await res.json();
      const tagNames = receivedTags.map(({ tagName }) => tagName);
      setMetadatas(metadataList);
      setTags(tagNames);
      setDescription(receivedDescription);
    };
    internal();
  }, [name]);


  return (
    <div>
      <h1>
        Metadata type:
        {` ${name}`}
      </h1>
      <p>
        {description}
      </p>
      <div>
        {tags.map((tag) => (
          <Tag key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
      <h3>This data set is offered by:</h3>
      <ul>
        {metadatas.map(({ uuid, municipalityName }) => (
          <a key={uuid} href={`/viewData/dataset/${uuid}`}>
            <p>
              {municipalityName}
            </p>
          </a>
        ))}
      </ul>
    </div>
  );
};

MetadataByTypeBody.propTypes = {
  name: PropTypes.string.isRequired,
};
