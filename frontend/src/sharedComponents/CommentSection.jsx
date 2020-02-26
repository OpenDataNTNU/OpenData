import React from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { CommentThread } from './CommentThread';
import { Comment } from './Comment';

const Wrapper = styled.div`
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
      user-select: none;
  position: relative;
  width: 100%;
  color: #000;
`;

const CommentSection = ({ comments }) => {
  const location = useLocation();
  const search = location.search !== '' ? location.search : null;
  const params = search ? new URLSearchParams(search) : null;
  const commentId = params ? params.get('comment') : null;

  const render = (parentId, children, doNotConstrainLength, selected) => {
    if (!children || !Object.keys(children).length > 0) {
      return null;
    }
    const components = [];

    const values = Object.values(children);
    const keys = Object.keys(children);
    const condition = !parentId && (doNotConstrainLength || values.length <= 5);
    const length = condition ? values.length : Math.min(values.length, 5);
    for (let i = 0; i < length; i += 1) {
      const value = values[i];
      const {
        uuid, author, timestamp, content, children: newChildren,
      } = value;

      components.push(
        <Comment
          id={keys[i]}
          uuid={uuid}
          author={author}
          timestamp={timestamp}
          content={content}
          selected={selected}
          subComments={render(keys[i], newChildren, doNotConstrainLength)}
        />,
      );
    }

    if (parentId && !doNotConstrainLength && values.length > 5) {
      components.push(
        <Link to={`${location.pathname}?comment=${parentId}`}>
          {values.length - length}
          {' '}
          more comments
        </Link>,
      );
    }

    return components;
  };

  const findComment = (_comments) => {
    for (const key of Object.keys(_comments)) {
      if (key === commentId) {
        return {
          [key]: _comments[key],
        };
      }

      if (_comments[key].children && Object.keys(_comments[key].children).length > 0) {
        return findComment(_comments[key].children);
      }
    }

    return null;
  };

  return (
    <Wrapper>
      <h2>
        Comments
      </h2>
      <CommentThread>
        {
          findComment(comments)
            ? render(null, findComment(comments), true, true)
            : render(null, comments)
        }
      </CommentThread>
    </Wrapper>
  );
};

CommentSection.propTypes = {
  comments: PropTypes.string.isRequired,
};

export {
  CommentSection,
};
