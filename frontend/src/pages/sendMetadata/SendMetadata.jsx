import React, { useState } from 'react';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';

const StyledForm = styled.form`
  flex: 1;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-content: space-around;
`;

const Input = styled.input`
  flex: 0;
  margin: 0.5em 1em;
`;

export const SendMetadata = () => {
  const [state, setState] = useState({
    name: '',
    description: '',
    tags: '',
    format: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...state };
    nextState[name] = value;
    setState(nextState);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(state);
  };

  const {
    name, description, tags, format,
  } = state;

  return (
    <Template>
      <StyledForm>
        <Input type="text" placeholder="name" name="name" value={name} onChange={handleChange} />
        <Input type="text" placeholder="description" name="description" value={description} onChange={handleChange} />
        <Input type="text" placeholder="tags (separated by comma)" name="tags" value={tags} onChange={handleChange} />
        <Input type="text" placeholder="format" name="format" value={format} onChange={handleChange} />
        <Input type="submit" value="Submit" onClick={handleSubmit} />
      </StyledForm>
    </Template>
  );
};
