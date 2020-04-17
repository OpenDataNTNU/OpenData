import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { NewComment } from './NewComment';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  font-size: 1em;
  background-color: white;
  padding: 0.4rem;
  margin-bottom: 0.8rem;
`;

const CommentHeader = styled.div`
  display: flex;
  flex-direction: row;
`;

const HeaderInfo = styled.p`
  font-weight: 500;
  padding: 0 0.3rem 0 0;
  font-size: 0.8rem;
  color: ${(props) => props.color};
`;

const CommentBody = styled.p`
  font-size: 0.9rem;
`;

const LoadMore = styled.p`
  cursor: pointer;
  font-size: 1rem;
`;

const ChildComments = styled.div`
  padding-left: 0.5rem;
  display: flex;
  flex-direction: column;
  border-left: 0.3rem solid lightgray;
`;

export const Comment = ({ comment, updateSelf }) => {
  const {
    content, userMail, published, edited, childComments, uuid, hasChildren,
  } = comment;

  // should keep a separate state, to allow for fetching other comments after commenting
  const [canLoad, setCanLoad] = useState(hasChildren && childComments.length === 0);

  const dispatch = useDispatch();

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

  const loadChildren = async () => {
    try {
      const res = await fetch(`/api/Comment/childcomments/${uuid}`);
      const { ok, status } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      const [{ childComments: receivedComments }] = await res.json();
      updateSelf({ ...comment, childComments: receivedComments }, uuid);
      setCanLoad(false);
    } catch (err) {
      dispatch(alertActions.error('Something went wrong while trying to get replies'));
    }
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
        {canLoad ? (
          <LoadMore onClick={loadChildren}>Load comments</LoadMore>
        ) : null}
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
  hasChildren: PropTypes.bool.isRequired,
};

commentTypes.childComments = PropTypes.arrayOf(PropTypes.shape(commentTypes)).isRequired;

Comment.propTypes = {
  comment: PropTypes.shape(commentTypes).isRequired,
  updateSelf: PropTypes.func.isRequired,
};
