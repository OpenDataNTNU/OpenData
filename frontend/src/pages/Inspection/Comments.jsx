import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { Comment } from './Comment';

const Wrapper = styled.div`
  padding-left: 0.5em;
  border-left: 0.1em solid #e4e4e4;
  max-width: 30em;
min-width: 15em;
`;

export const Comments = (props) => {
  const { comments } = props;
  return (
    <Wrapper>
      <h2>Feedback</h2>
      {comments.map(({
        id, comment, author, date,
      }) => (
        <Comment
          key={id}
          comment={comment}
          author={author}
          date={date}
        />
      ))}
    </Wrapper>
  );
};

Comments.propTypes = {
  comments: PropTypes.arrayOf(PropTypes.object).isRequired,
};
