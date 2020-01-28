import React, { useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  margin: auto;
`;

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

export const MetadataForm = () => {
  const [state, setState] = useState({
    name: '',
    description: '',
    tags: '',
    format: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...state };
    nextState[name] = value;
    setState(nextState);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(state);
    const res = await fetch('/data/submit', {
      method: 'POST',
      body: JSON.stringify(state),
      headers: {
        format: 'application/json',
      },
    });
    try {
      await res.json();
      // assuming that any successful response is a JSON object
      setStatus('ok');
    } catch (err) {
      console.log(err);
      setStatus('error');
    }
  };

  const {
    name, description, tags, format,
  } = state;

  return (
    <Wrapper>
      <StyledForm>
        <Input type="text" placeholder="name" name="name" value={name} onChange={handleChange} />
        <Input type="text" placeholder="description" name="description" value={description} onChange={handleChange} />
        <Input type="text" placeholder="tags (separated by comma)" name="tags" value={tags} onChange={handleChange} />
        <Input type="text" placeholder="format" name="format" value={format} onChange={handleChange} />
        <Input type="submit" value="Submit" onClick={handleSubmit} />
      </StyledForm>
      {
        status === 'error' ? (
          <div>Noe gikk galt</div>
        ) : null
      }
      {
        status === 'ok' ? (
          <div>Metadata ble sendt!</div>
        ) : null
      }
    </Wrapper>
  );
};
