import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Thread = styled.div`
  margin-left: 3em;
  position: relative;

  &:before {
    position: absolute;
    left: -20px;
    display: block;
    width: 2px;
    content: "";
    background-color: rgb(203, 206, 210);
    height: ${(props) => props.height || 0}px;
  }
`;

const CommentThread = ({ children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref, children]);

  return (
    <Thread height={height} ref={ref}>
      {
        children
      }
    </Thread>
  );
};

CommentThread.propTypes = {
  children: PropTypes.node.isRequired,
};

export {
  CommentThread,
};
