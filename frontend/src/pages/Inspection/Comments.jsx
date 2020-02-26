import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import { Comment } from './Comment';
import { NewComment } from './NewComment';

const Wrapper = styled.div`
  padding-left: 0.5em;
  border-left: 0.1em solid #e4e4e4;
  max-width: 30em;
  min-width: 15em;
`;

export const Comments = ({ id }) => {
  const [comments, setComments] = useState([]);

  const userSelector = useSelector((state) => state.user);

  const addComment = (comment) => {
    const { mail } = userSelector.user;
    const d = new Date();
    setComments([...comments, {
      id: new Date() - 1,
      comment,
      author: {
        mail,
      },
      date: `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`,
    }]);
  };

  useEffect(() => {
    const internal = async () => {
      setComments([{
        id: 1,
        comment: 'Beautiful comment',
        author: {
          mail: 'michael@b.ay',
        },
        date: '19-02-2019',
      },
      {
        id: 2,
        comment: 'Harsh comment',
        author: {
          mail: 'Shark@na.do',
        },
        date: '23-07-2019',
      }]);
    };
    internal();
  }, [id]);

  return (
    <Wrapper>
      <h2>Comments</h2>
      {comments.map(({
        id: commentId, comment, author: { mail }, date,
      }) => (
        <Comment
          key={commentId}
          comment={comment}
          author={mail}
          date={date}
        />
      ))}
      <NewComment addComment={addComment} uuid={id} />
    </Wrapper>
  );
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
};
