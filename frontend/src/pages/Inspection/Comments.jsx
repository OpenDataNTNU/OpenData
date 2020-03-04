import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { Comment } from './Comment';
import { NewComment } from './NewComment';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  padding-left: 0.5em;
  border-left: 0.1em solid #e4e4e4;
  max-width: 30em;
  min-width: 15em;
`;

export const Comments = ({ id }) => {
  const [comments, setComments] = useState([]);

  const userSelector = useSelector((state) => state.user);
  const dispatch = useDispatch();

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
        dispatch(alertActions.error('Something went wrong while fetching comments'));
      }
    };
    internal();
  }, [id]);

  return (
    <Wrapper>
      <h2>Comments</h2>
      {comments.length ? comments.map((comment) => {
        const { commentId } = comment;
        return (
          <Comment
            key={commentId}
            comment={comment}
          />
        );
      }) : (
        <p>
          No one has commented on this dataset yet
        </p>
      )}
      <NewComment addComment={addComment} uuid={id} />
    </Wrapper>
  );
};

Comments.propTypes = {
  id: PropTypes.string.isRequired,
};
