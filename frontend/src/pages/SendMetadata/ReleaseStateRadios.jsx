import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const HorizontalWrapper = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
`;

const RadioLabel = styled.label`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  border-radius: 0.2em;
  padding: 0.2em;
  margin-bottom: 5px;
  ${({ background }) => (background ? `background-color: ${background};` : '')}
  ${({ border }) => (border ? `border: 1px solid ${border};` : '')}

  &:not(:last-child) {
    margin-right: 8px;
  }
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  margin: 0px 5px 0px 0px;
`;

export const ReleaseStateRadios = ({ releaseState, handleRadioChange }) => (
  <HorizontalWrapper>
    <RadioLabel htmlFor="bluelight" background="#9999dd" border="#6666aa">
      <Radio
        type="radio"
        name="releaseState"
        value={1}
        id="bluelight"
        checked={releaseState === 1}
        onChange={handleRadioChange}
        required
      />
      {' Released'}
    </RadioLabel>
    <RadioLabel htmlFor="greenlight" background="#ccffcc" border="#00ff00">
      <Radio
        type="radio"
        name="releaseState"
        value={2}
        id="greenlight"
        checked={releaseState === 2}
        onChange={handleRadioChange}
        required
      />
      {' Ready for release'}
    </RadioLabel>
    <RadioLabel htmlFor="yellowlight" background="#ffffcc" border="#d8d800">
      <Radio
        type="radio"
        name="releaseState"
        value={3}
        id="yellowlight"
        checked={releaseState === 3}
        onChange={handleRadioChange}
        required
      />
      {' Needs work'}
    </RadioLabel>
    <RadioLabel htmlFor="redlight" background="#ffcccc" border="#ff5555">
      <Radio
        type="radio"
        name="releaseState"
        value={4}
        id="redlight"
        checked={releaseState === 4}
        onChange={handleRadioChange}
        required
      />
      {' Unreleasable'}
    </RadioLabel>
  </HorizontalWrapper>
);

ReleaseStateRadios.propTypes = {
  releaseState: PropTypes.number.isRequired,
  handleRadioChange: PropTypes.func.isRequired,
};
