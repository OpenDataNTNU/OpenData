import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { Comment } from './Comment';
import { NewComment } from './NewComment';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  max-width: 30rem;
  min-width: 15rem;
  padding: 0.5rem;
`;
const CommentsCard = styled.div`
  padding: 0.5rem;
  border-radius: 0.3rem;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  background-color: white;
  & > h2 {
    margin: 0.3rem 0;
  }
`;
export const Comments = ({ id }) => {
  const [comments, setComments] = useState([]);

  const dispatch = useDispatch();

  const addComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const updateComment = (comment, uuid) => {
    // find index of the comment in question
    const index = comments.findIndex((c) => c.uuid === uuid);
    const pre = comments.slice(0, index);
    const post = comments.slice(index + 1);
    setComments([...pre, comment, ...post]);
  };

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/Comment/metadata/${id}`);
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const receivedComments = await res.json();
        setComments(receivedComments);
      } catch (err) {
        dispatch(alertActions.error('Something went wrong while fetching comments'));
      }
    };
    internal();
  }, [id]);

  return (
    <Wrapper>
      <CommentsCard>
        <h2>Comments</h2>
        {comments.length ? comments.map((comment) => {
          const { uuid } = comment;
          return (
            <Comment
              key={uuid}
              updateSelf={updateComment}
              comment={comment}
            />
          );
        }) : (
          <p>
            No one has commented on this dataset yet
          </p>
        )}
        <NewComment addComment={addComment} uuid={id} />
      </CommentsCard>
    </Wrapper>
  );
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
};
