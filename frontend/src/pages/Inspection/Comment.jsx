import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NewComment } from './NewComment';

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

const CommentBody = styled.p`
  font-size: 0.9em;
`;

const ChildComments = styled.div`
  padding-left: 1em;
  display: flex;
  flex-direction: column;
  border-left: 2px solid black;
`;

export const Comment = ({ comment, updateSelf }) => {
  const {
    content, userMail, published, edited, childComments, uuid,
  } = comment;

  const updateChild = (childComment, childUuid) => {
    const index = childComments.findIndex((c) => c.uuid === childUuid);
    const pre = childComments.slice(0, index);
    const post = childComments.slice(index + 1);
    const newChildren = [...pre, childComment, ...post];
    updateSelf({ ...comment, childComments: newChildren }, uuid);
  };

  const addChild = (childComment) => {
    const newChildren = [...childComments, childComment];
    updateSelf({ ...comment, childComments: newChildren }, uuid);
  };

  return (
    <Wrapper>
      <CommentHeader>
        <HeaderInfo color="3e3e3e">{userMail}</HeaderInfo>
        <HeaderInfo color="dimgray">
          {published}
          {published !== edited ? ` (edited ${edited})` : ''}
        </HeaderInfo>
      </CommentHeader>
      <CommentBody>
        {content}
      </CommentBody>
      <ChildComments>
        {childComments.map((child) => (
          <Comment key={child.uuid} comment={child} updateSelf={updateChild} />
        ))}
        <NewComment uuid={uuid} addComment={addChild} isReply />
      </ChildComments>
    </Wrapper>
  );
};

const commentTypes = {
  uuid: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  userMail: PropTypes.string.isRequired,
  published: PropTypes.string.isRequired,
  edited: PropTypes.string.isRequired,
};

commentTypes.childComments = PropTypes.arrayOf(PropTypes.shape(commentTypes)).isRequired;

Comment.propTypes = {
  comment: PropTypes.shape(commentTypes).isRequired,
  updateSelf: PropTypes.func.isRequired,
};
