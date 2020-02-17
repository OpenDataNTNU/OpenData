import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const ReleaseStateLabelContainer = styled.div`
  float: right;
  margin: 0.1em;
  display: inline-block;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 0.2em;
`;
const Text = styled.p`
  color: ${(props) => props.color};
  padding: 0.4em;
  font-size: 0.9em;
  margin: 0;
`;

const ReleaseStateLabel = (props) => {
  const { releaseState } = props;

  const selected = ((stateNumber) => {
    switch (stateNumber) {
      case 1: return {
        text: 'Released',
        textColor: '#6f6fa1',
        backgroundColor: '#dddfff',
      };
      case 2: return {
        text: 'Ready to release',
        textColor: '#43a73c',
        backgroundColor: '#dbffdd',
      };
      case 3: return {
        text: 'Needs work',
        textColor: '#9e8a37',
        backgroundColor: '#ffeeb8',
      };
      case 4: return {
        text: 'Not releasable',
        textColor: '#cc4444',
        backgroundColor: '#ffdedf',
      };
      default: return {
        text: 'Unknown release state!',
        textColor: '#6b1348',
        backgroundColor: '#ffd2f5',
      };
    }
  })(releaseState);

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
