import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ReleaseStateLabelContainer = styled.div`
  float: right;
  margin: 0.1rem;
  display: inline-block;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 0.2rem;
`;
const Text = styled.p`
  color: ${(props) => props.color};
  padding: 0.4rem;
  font-size: 0.9rem;
  margin: 0;
`;
const releaseStates = {
  1: {
    text: 'Released',
    textColor: '#6f6fa1',
    backgroundColor: '#dddfff',
  },
  2: {
    text: 'Ready to release',
    textColor: '#43a73c',
    backgroundColor: '#dbffdd',
  },
  3: {
    text: 'Needs work',
    textColor: '#9e8a37',
    backgroundColor: '#ffeeb8',
  },
  4: {
    text: 'Not releasable',
    textColor: '#cc4444',
    backgroundColor: '#ffdedf',
  },
  fallback: {
    text: 'Unknown release state!',
    textColor: '#6b1348',
    backgroundColor: '#ffd2f5',
  },
};

const ReleaseStateLabel = ({ releaseState }) => {
  const selected = releaseStates[releaseState] || releaseStates.fallback;
  return (
    <ReleaseStateLabelContainer backgroundColor={selected.backgroundColor}>
      <Text color={selected.textColor}>{selected.text}</Text>
    </ReleaseStateLabelContainer>
  );
};

ReleaseStateLabel.propTypes = {
  releaseState: PropTypes.number.isRequired,
};

export {
  ReleaseStateLabel,
};
