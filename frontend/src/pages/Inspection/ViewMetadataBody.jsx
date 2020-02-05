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
  // update this to match the relevant fields
  const [data, setData] = useState({
    municipality: 'Trondheim',
    format: '.json',
    url: 'https://trondheim.kommune.no',
    tags: ['Ipsum', 'Ad, asperiores!'],
  });
  /* example data, if backend isn't up:
  data: {
    municipality: 'Trondheim',
    format: '.json',
    url: 'https://trondheim.kommune.no',
    tags: ['Ipsum', 'Ad, asperiores!'],
  }
  comments: [{
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
  }];
  */
  const [comments, setComments] = useState([{
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
  useEffect(() => {
    const internal = async () => {
      const res = await fetch(`/api/data/${id}`);
      const {
        municipality, format, url, comments: receivedComments,
      } = await res.json();
      setData({ municipality, format, url });
      setComments(receivedComments);
    };
    internal();
  });


  return (
    <Wrapper>
      <MetaData id={id} data={data} />
      <Comments comments={comments} />
    </Wrapper>
  );
};

ViewMetadataBody.propTypes = {
  id: PropTypes.string.isRequired,
};
