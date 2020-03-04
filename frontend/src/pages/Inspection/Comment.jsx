import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';


const Wrapper = styled.div`
  font-size: 0.9em;
  background-color: white;
  padding: 0.8em;
  border-radius: 0.8em;
  margin-bottom: 0.8em;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeaderInfo = styled.p`
  font-weight: 500;
  padding: 0 0.5em 0 0;
  color: ${(props) => props.color};
`;

const CommentBody = styled.div`
  font-size: 0.9em;
`;

export const Comment = ({ comment }) => {
  const {
    content, author, published, edited,
  } = comment;
  return (
    <Wrapper>
      <CommentHeader>
        <HeaderInfo color="3e3e3e">{author}</HeaderInfo>
        <HeaderInfo color="dimgray">
          {published}
          {published !== edited ? ` (edited ${edited})` : ''}
        </HeaderInfo>
      </CommentHeader>
      <CommentBody>
        <p>{content}</p>
      </CommentBody>
    </Wrapper>
  );
};

const commentTypes = {
  comment: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
  edited: PropTypes.string.isRequired,
};

commentTypes.childcomments = PropTypes.arrayOf(PropTypes.shape(commentTypes));

Comment.propTypes = {
  comment: commentTypes.isRequired,
};
