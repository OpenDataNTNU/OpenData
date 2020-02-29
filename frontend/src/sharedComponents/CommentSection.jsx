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

const StyledLink = styled(Link)`
  font-size: 0.9em;
`;

const CommentSection = ({ comments }) => {
  // React router dom get location object for search parameters
  const location = useLocation();
  const search = location.search !== '' ? location.search : null;
  const params = search ? new URLSearchParams(search) : null;
  // The commentId in the url for when a comment is selected
  const commentId = params ? params.get('comment') : null;
  // Function to render comments recursivly
  /*
   * @Param parentId: String; The commentId of the 'childrens' parent comment
   * @Param children: Object; The child comment objects inside an object
   * @Param depth: Int; The current depth of the comment parent-child structure (0-indexed)
   * @Param doNotConstrainLength: Boolean; Decideds wheter or not to show "Load more comments"
   * @Param selected: Boolean; Decideds wheter or not a comment is selected (through the url)
   */
  const render = (_comments, depth, doNotConstrainLength, selected) => {
    // If childrens are empty or the object is empty then return null
    if (!_comments || _comments.length <= 0) {
      return null;
    }

    const parentId = _comments[0].parentcommentuuid;

    // Incrase depth by 1
    const newDepth = depth + 1;

    // The return components
    const components = [];

    // The condition for wheter or not to show all in that depth (stops at 5 if ot)
    const condition = !parentId || (doNotConstrainLength || _comments.length <= 5);
    // Set the amount of comments (at this depth) to show
    const length = condition ? _comments.length : Math.min(_comments.length, 5);

    // Only render to the depth level of 5 before showing "load more comments"
    if (depth < 5) {
      // Create 'length' amount of comments
      for (let i = 0; i < length; i += 1) {
        // Deconstruct comment
        const {
          uuid, content, usermail, published, childcomments,
        } = _comments[i];

        // Append comment element to return array
        components.push(
          <Comment
            uuid={uuid}
            author={usermail}
            timestamp={published}
            content={content}
            selected={selected}
            subComments={render(childcomments, newDepth, doNotConstrainLength)}
          />,
        );
      }
    }

    // Append "Load more comments" link element to return array if
    // the condition is true
    if ((parentId && !doNotConstrainLength && _comments.length > 5) || depth >= 5) {
      components.push(
        <StyledLink to={`${location.pathname}?comment=${parentId}`}>
          Load more comments...
        </StyledLink>,
      );
    }

    // Return the components
    return components;
  };

  // Look for a specific comment thread
  /*
   * @Params _comments:
   */
  const findComment = (_comments) => {
    // Loop over all the comments
    for (const comment of _comments) {
      // check if the key is equal to the commentId we are searching for
      if (comment.uuid === commentId) {
        // return the thread if found
        return [comment];
      }

      // Check if the children is not empty
      if (comment.childcomments && comment.childcomments.length > 0) {
        // Recursivly search for the commeent
        const commentSearch = findComment(comment.childcomments);
        // If its found, return the thread
        if (commentSearch) {
          return commentSearch;
        }
      }
    }

    // If nothing is found return null
    return null;
  };

  return (
    <Wrapper>
      <h2>
        Comments
      </h2>
      <CommentThread>
        {
          commentId
            ? render(findComment(comments), 0, true, true)
            : render(comments, 0)
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
