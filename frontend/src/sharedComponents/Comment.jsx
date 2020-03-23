import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
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
  padding: 0px 5px 5px 5px;
  margin-bottom: 10px;
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
  uuid, author, timestamp, content, selected, subComments, onresize, callback,
}) => {
  // Redux
  const userSelector = useSelector((state) => state.user);
  const user = userSelector ? userSelector.user : null;

  // React router dom for getting the location object
  const location = useLocation();

  // State
  const [showNewComment, setShowNewComment] = useState(false);

  // Thread ref
  const ref = useRef(null);

  const [height, setHeight] = useState(null);

  // Update height on ref or children change
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    } else {
      setHeight(-height);
    }
  }, [showNewComment]);

  useEffect(() => {
    onresize(height);
  }, [height]);

  // Function to show or hide new comment input
  const onClick = () => {
    setShowNewComment(!showNewComment);
  };

  const onComplete = () => {
    setShowNewComment(false);
    callback();
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
        {
          user
            ? (
              <Footer>
                <span role="button" onClick={onClick} onKeyDown={onClick} tabIndex={0}>Reply</span>
              </Footer>
            )
            : null
        }
      </Wrapper>
      {
      showNewComment
        ? <NewComment putUrl={`/api/Comment/reply/${uuid}`} onComplete={onComplete} buttonText="Reply" ref={ref} />
        : null
      }
      {
        subComments && subComments.length > 0
          ? (
            <CommentThread onresize={onresize}>
              {subComments.map((comment) => comment)}
            </CommentThread>
          )
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
  onresize: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
};

export {
  Comment,
};
