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

  const addComment = (content, uuid) => {
    const { mail } = userSelector.user;
    const d = new Date();
    const dateString = `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    setComments([...comments, {
      uuid,
      content,
      usermail: mail,
      published: dateString,
      edited: dateString,
    }]);
  };

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/metadata/${id}/comments`);
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const receivedComments = await res.json();
        setComments(receivedComments);
      } catch (err) {
        setComments([{
          uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa7',
          content: 'Beautiful comment, indicating that the comments haven\'t been properly loaded',
          usermail: 'michael@b.ay',
          published: '19-02-2019',
          edited: '19-02-2019',
        },
        {
          uuid: '3fa85f64-5717-4562-b3fc-2c963f66afa8',
          content: 'Harsh comment, criticizing how the fetch request failed and that this is merely placeholder data',
          usermail: 'Shark@na.do',
          published: '23-07-2019',
          edited: '19-02-2020',
        }]);
      }
    };
    internal();
  }, [id]);

  return (
    <Wrapper>
      <h2>Comments</h2>
      {comments.map(({
        uuid: commentId, content, usermail, published, edited,
      }) => (
        <Comment
          key={commentId}
          comment={content}
          author={usermail}
          published={published}
          edited={edited}
        />
      ))}
      <NewComment addComment={addComment} uuid={id} />
    </Wrapper>
  );
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
};
