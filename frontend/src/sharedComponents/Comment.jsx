import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { NewComment } from './NewComment';
import { CommentThread } from './CommentThread';
import { DateToString } from './utilities';

const Wrapper = styled.div`
  font-size: 0.9em;
  background-color: ${(props) => (props.selected ? 'rgba(1,73,128,0.05)' : 'white')};
  border-radius: 4px;
  padding: 5px;
  margin-bottom: 0.8em;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
`;

const Info = styled.span`
  font-weight: 500;
  color: ${(props) => props.color};
`;

const StyledLink = styled(Link)`
  font-weight: 500;
  color: dimgray;
  font-size: 0.9em;
`;

const Body = styled.div`
  font-size: 1.1em;
`;

const Footer = styled.div`
  color: #878A8C;
  font-size: 12px;
  font-weight: 700;
  line-height: 16px;
  margin-top: 5px;
`;

const Comment = ({
  uuid, author, timestamp, content, selected, subComments,
}) => {
  // React router dom for getting the location object
  const location = useLocation();

  // State
  const [showNewComment, setShowNewComment] = useState(false);

  // Function to call once reply is written and submitted
  const onReply = (_content) => {

  };

  // Function to show or hide new comment input
  const onClick = () => {
    setShowNewComment(!showNewComment);
  };

  return (
    <>
      <Wrapper selected={selected}>
        <Header>
          <Info color="3e3e3e">{author}</Info>
          <StyledLink to={`${location.pathname}?comment=${uuid}`}>{timestamp && DateToString(timestamp)}</StyledLink>
        </Header>
        <Body>
          <p>{content}</p>
        </Body>
        <Footer>
          <span role="button" onClick={onClick} onKeyDown={onClick} tabIndex={0}>Reply</span>
        </Footer>
      </Wrapper>
      {
      showNewComment
        ? <NewComment onClick={onReply} />
        : null
      }
      {
        subComments
          ? <CommentThread>{subComments.map((comment) => comment)}</CommentThread>
          : null
      }
    </>
  );
};

Comment.defaultProps = {
  subComments: null,
};

Comment.propTypes = {
  uuid: PropTypes.string.isRequired,
  author: PropTypes.string.isRequired,
  timestamp: PropTypes.instanceOf(Date).isRequired,
  content: PropTypes.string.isRequired,
  selected: PropTypes.bool.isRequired,
  subComments: PropTypes.arrayOf(PropTypes.elementType),
};

export {
  Comment,
};
