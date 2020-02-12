import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { MetaData } from './MetaData';
import { Comments } from './Comments';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const ViewMetadataBody = (props) => {
  const { id } = props;
  const [data, setData] = useState({
    uuid: id,
    url: '',
    formatName: '',
    releaseState: 0,
    metadataTypeName: '',
    municipalityName: '',
  });
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const internal = async () => {
      const res = await fetch(`/api/metadata/${id}`);
      const municipality = await res.json();
      setData(municipality);
      // get received comments when this is implemented backend
      setComments([{
        id: 1,
        comment: 'Beautiful comment',
        author: 'Michael Bay',
        date: '19-02-2019',
      },
      {
        id: 2,
        comment: 'Harsh comment',
        author: 'Sharknado',
        date: '23-07-2019',
      }]);
    };
    internal();
  }, [id]);

  useEffect(() => {
    const { metadataTypeName: name } = data;
    if (name) {
      const internal = async () => {
        const res = await fetch(`/api/MetadataType/${name}`);
        const { tags: receivedTags, description: receivedDescription } = await res.json();
        const tagNames = receivedTags.map(({ tagName }) => tagName);
        setTags(tagNames);
        setDescription(receivedDescription);
      };
      internal();
    }
  }, [data]);

  return (
    <Wrapper>
      <MetaData data={data} description={description} tags={tags} />
      <Comments comments={comments} />
    </Wrapper>
  );
};

ViewMetadataBody.propTypes = {
  id: PropTypes.string.isRequired,
};
