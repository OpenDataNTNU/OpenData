import React from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes, css } from 'styled-components';

const rotate360 = keyframes` 
  100% {
      transform: rotate(360deg);
  }
`;

const exist = keyframes` 
  100% {
      width: 15px;
      height: 15px;
      margin: -8px 5px 0 0;
  }
`;

const Button = styled.button`
  padding: 0.3em;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: .875rem;
  line-height: 2.25rem;
  font-weight: 500;
  letter-spacing: .0892857143em;
  text-decoration: none;
  border-radius: 0.3em;
  color: #7e6dad;
  background-color: #dcd8ff;
  border: solid 0.1em #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 1em 0 0.8em 0;
  cursor: pointer;
  position: relative;

  &:before {
    content: ${(props) => (props.loading ? '"";' : null)}
    width: ${(props) => (props.loading ? '0px;' : null)}
    height: ${(props) => (props.loading ? '0px;' : null)}
    border-radius: ${(props) => (props.loading ? '50%;;' : null)}
    right: ${(props) => (props.loading ? '6px;' : null)}
    top: ${(props) => (props.loading ? '50%;' : null)}
    position: ${(props) => (props.loading ? 'absolute;' : null)}
    border: ${(props) => (props.loading ? '2px solid #000000;' : null)}
    border-right: ${(props) => (props.loading ? '2px solid #bc13fe;' : null)}
    animation: ${(props) => (props.loading ? css`${rotate360} .5s infinite linear, ${exist} .1s forwards ease;` : null)}
  }

  &:hover {
    ${(props) => (props.disabled ? null : 'background-color: #A19AE6')};
    ${(props) => (props.disabled ? null : 'color: #ffffff')};
  }

  &:active {
    background-color: #A19AE6;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #544D99;
    color: #ffffff;
    opacity: 60%;
  }
`;

const LoadingButton = ({ text, loading, onClick, ...rest }) => {
  // sets loading to true and calls callback onclick
  const callback = (e) => {
    onClick(e);
  };

  return (
    <Button type="submit" onClick={callback} loading={loading} {...rest}>
      { text }
    </Button>
  );
};

LoadingButton.defaultProps = {
  rest: null,
};

LoadingButton.propTypes = {
  text: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  rest: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export {
  LoadingButton,
};
