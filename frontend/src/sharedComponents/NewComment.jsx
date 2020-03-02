import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { alertActions } from '../state/actions/alert';

const Comment = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CommentTextArea = styled.textarea`
  height: 75px;
  resize: none;
  border: 1px solid lightgray;
  border-bottom: none;
  border-radius: 4px 4px 0px 0px;
`;

const CommentFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border: 1px solid lightgray;
  border-top: none;
  background-color: #F6F7F8;
  border-radius: 0px 0px 4px 4px;
  padding: 8px;
  margin-bottom: 0.8em;
`;

const CommentButton = styled.button`

`;

const NewComment = React.forwardRef(({ putUrl, onComplete }, ref) => {
  // Redux state
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { token } = userSelector.user;

  // State
  const [content, setContent] = useState('');

  const OnClick = () => {
    const data = {
      content,
    };

    try {
      const response = fetch(putUrl, {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(data),
      });

      if (response.ok && response.status === 200) {
        dispatch(alertActions.success('Comment successfully submitted. Redirecting in 3 seconds.'));
        setContent('');

        if (typeof (onComplete) === 'function') {
          onComplete();
        }
      } else {
        throw new Error();
      }
    } catch (_) {
      dispatch(alertActions.error('Failed to submit comment.'));
    }
  };

  const onChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <Comment ref={ref}>
      <CommentTextArea value={content} onChange={onChange} />
      <CommentFooter>
        <CommentButton onClick={OnClick}>Reply</CommentButton>
      </CommentFooter>
    </Comment>
  );
});

NewComment.propTypes = {
  putUrl: PropTypes.string.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export {
  NewComment,
};
