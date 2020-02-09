import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  border: none;
  border-bottom: solid 1px #8e8e8e;
  background-color: #f4f4f4;
  font-size: 16px;
  padding-left: 5px;
  box-sizing: border-box;
`;

const Input = ({
  title, value, onChange, rest,
}) => <StyledInput name={title} value={value} onChange={onChange} {...rest} />;

Input.defaultProps = {
  rest: null,
};

Input.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  rest: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

export {
  Input,
};
