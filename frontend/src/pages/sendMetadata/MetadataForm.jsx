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
  flex: 0 0 2em;
  margin: 0.5em 1em;
`;

const Select = styled.select`
  flex: 0 0 2em;
  margin: 0.5em 1em;
`;

const RadioLabel = styled.label`
  border-radius: 0.2em;
  padding: 0.2em;
  ${(props) => (props.background ? `background-color: ${props.background};` : '')}
  ${(props) => (props.border ? `border: 1px solid ${props.border};` : '')}
`;

const HorizontalWrapper = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
`;

export const MetadataForm = () => {
  const [state, setState] = useState({
    light: '',
    description: '',
    tags: '',
    format: '',
    municipality: '',
  });
  const [status, setStatus] = useState('');
  // municipalities should be objects with a "name" key
  const [municipalities, setMunicipalities] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...state };
    nextState[name] = value;
    setState(nextState);
  };

  useState(() => {
    const internal = async () => {
      const res = await fetch('/api/municipalities');
      const { municipalities: receivedMuniciplalities } = await res.json();
      if (receivedMuniciplalities) {
        setMunicipalities(receivedMuniciplalities);
      }
    };
    internal();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const res = await fetch('/api/datasets/submit', {
        method: 'POST',
        body: JSON.stringify(state),
        headers: {
          format: 'application/json',
        },
      });
      await res.json();
      // assuming that any successful response is a JSON object
      setStatus('ok');
    } catch (err) {
      // could console.log(err); when debugging, but it clutters up outputs from the tests
      setStatus('error');
    }
  };

  const {
    light, description, tags, format, municipality,
  } = state;

  return (
    <Wrapper>
      <StyledForm>
        <HorizontalWrapper>
          <RadioLabel htmlFor="greenlight" background="#ccffcc" border="#00ff00">
            <Input type="radio" name="light" value="green" id="greenlight" checked={light === 'green'} onChange={handleChange} />
            {' '}
Green
          </RadioLabel>
          <RadioLabel htmlFor="yellowlight" background="#ffffcc" border="#ffff00">
            <Input type="radio" name="light" value="yellow" id="yellowlight" checked={light === 'yellow'} onChange={handleChange} />
            {' '}
Yellow
          </RadioLabel>
          <RadioLabel htmlFor="redlight" background="#ffcccc" border="red">
            <Input type="radio" name="light" value="red" id="redlight" checked={light === 'red'} onChange={handleChange} />
            {' '}
Red
          </RadioLabel>
        </HorizontalWrapper>
        <Input type="text" placeholder="description" name="description" value={description} onChange={handleChange} />
        <Input type="text" placeholder="tags (separated by comma)" name="tags" value={tags} onChange={handleChange} />
        <Input type="text" placeholder="format" name="format" value={format} onChange={handleChange} />
        <Select name="municipality" value={municipality} onChange={handleChange}>
          <option value="">Municipality</option>
          {
            municipalities.map(({ name }) => (<option value={name}>{name}</option>))
          }
        </Select>
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
