import React, {
  useState, useEffect, useRef, useCallback,
} from 'react';
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

const CommentThread = ({ children, onresize }) => {
  // Thread ref
  const ref = useRef(null);

  // Thread heifght
  const [height, setHeight] = useState(null);

  // Update height on ref or children change
  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, [ref, children]);

  const newCommentUpdate = useCallback((_height) => {
    setHeight(height + _height);
    if (typeof (onresize) === 'function') {
      onresize(_height);
    }
  });

  return (
    <Thread height={height} ref={ref}>
      {
        React.Children.map(
          children,
          (child) => React.cloneElement(child, { onresize: newCommentUpdate }),
        )
      }
    </Thread>
  );
};

CommentThread.defaultProps = {
  onresize: null,
};

CommentThread.propTypes = {
  children: PropTypes.node.isRequired,
  onresize: PropTypes.func,
};

export {
  CommentThread,
};
