import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const NewComment = React.forwardRef(({ onClick }, ref) => {
  const [Content, setContent] = useState('');

  const OnClick = () => {
    onClick(Content);
  };

  const onChange = (e) => {
    setContent(e.target.value);
  };

  return (
    <Comment ref={ref}>
      <CommentTextArea value={Content} onChange={onChange} />
      <CommentFooter>
        <CommentButton onClick={OnClick}>Reply</CommentButton>
      </CommentFooter>
    </Comment>
  );
});

NewComment.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export {
  NewComment,
};
