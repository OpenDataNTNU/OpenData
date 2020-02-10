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
    description: '',
    formatName: '',
    releaseState: 0,
    metadataTypeName: '',
    municipalityName: '',
  });
  const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    const internal = async () => {
      const res = await fetch(`/api/metadata/${id}`);
      const municipality = await res.json();
      // get received comments
      setData(municipality);
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
      setTags(['Ipsum', 'Ad, asperiores!']);
    };
    internal();
  }, [id]);


  return (
    <Wrapper>
      <MetaData id={id} data={data} tags={tags} />
      <Comments comments={comments} />
    </Wrapper>
  );
};

ViewMetadataBody.propTypes = {
  id: PropTypes.string.isRequired,
};
