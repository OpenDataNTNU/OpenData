import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.form`
  font-size: 0.9em;
  background-color: white;
  padding: 0.8em;
  border-radius: 0.8em;
  margin-bottom: 0.8em;
  display: flex;
  flex-direction: column;
`;

const CommentField = styled.textarea`
  padding: 0.3em;
  font-size: 1.0em;
  border-radius: 0.3em;
  border: solid 0.1em
  lightgrey;
  display: block;
  min-height: 4em;
  box-sizing: border-box;
  margin: 0.3em 0;
  min-width: 100%;
`;

const SubmitButton = styled.input`
  padding: 0.3em;
  font-size: 1.1em;
  border-radius: 0.3em;
  color: #7e6dad;
  background-color: #dcd8ff;
  border: solid 0.1em #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 1em 0 0.8em;
`;

const LoggedOutWrapper = styled.div`
  font-size: 0.9em;
  background-color: white;
  padding: 0.8em;
  border-radius: 0.8em;
  margin-bottom: 0.8em;
`;

export const NewComment = ({ uuid, addComment }) => {
  const [commentText, setCommentText] = useState('');

  const userSelector = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const { token } = userSelector.user;
      const res = await fetch(`/api/metadata/${uuid}/comments`, {
        method: 'PUT',
        body: JSON.stringify({
          content: commentText,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      const { ok, status } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      addComment(commentText);
      setCommentText('');
    } catch (err) {
      const { status } = err;
      if (status === 402) {
        dispatch(alertActions.error('Something went wrong while validating your login - please try to log out and back in'));
      } else if (status === 500) {
        dispatch(alertActions.error('Something went wrong while processing your comment - please try again later'));
      } else {
        dispatch(alertActions.error('Something went wrong'));
      }
    }
  };

  const { loggedIn } = userSelector;

  return loggedIn ? (
    <Wrapper onSubmit={submit}>
      <CommentField placeholder="Leave a comment" value={commentText} onChange={(e) => setCommentText(e.target.value)} required />
      <SubmitButton type="submit" value="Post Comment" />
    </Wrapper>
  ) : (
    <LoggedOutWrapper>
      <Link to="/login">
        Logg inn
      </Link>
      {' '}
      for å legge til en kommentar
    </LoggedOutWrapper>
  );
};

NewComment.propTypes = {
  addComment: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};
