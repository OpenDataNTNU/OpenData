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
  color: ${(props) => props.color};
`;

const CommentBody = styled.div`
  font-size: 0.9em;
`;

export const Comment = (props) => {
  const { comment, author, date } = props;
  return (
    <Wrapper>
      <CommentHeader>
        <HeaderInfo color="3e3e3e">{author}</HeaderInfo>
        <HeaderInfo color="dimgray">{date}</HeaderInfo>
      </CommentHeader>
      <CommentBody>
        <p>{comment}</p>
      </CommentBody>
    </Wrapper>
  );
};

Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};
