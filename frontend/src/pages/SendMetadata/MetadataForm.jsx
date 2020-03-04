import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { alertActions } from '../../state/actions/alert';

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

const TextArea = styled.textarea`
  flex: 0 0 10em;
  margin: 0.5em 1em;
`;

const RadioLabel = styled.label`
  border-radius: 0.2em;
  padding: 0.2em;
  ${({ background }) => (background ? `background-color: ${background};` : '')}
  ${({ border }) => (border ? `border: 1px solid ${border};` : '')}
`;

const HorizontalWrapper = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
`;

export const MetadataForm = () => {
  const [state, setState] = useState({
    metadataTypeName: '',
    releaseState: 1,
    description: '',
    formatName: '',
    municipalityName: '',
    url: '',
  });

  const [metadataTypes, setMetadataTypes] = useState([]);
  const dataFormats = ['JSON', 'CSV'];

  const [submissionStatus, setSubmissionStatus] = useState('');

  const dispatch = useDispatch();
  const userSelector = useSelector((s) => s.user);

  const { municipalityName: userMunicipality } = userSelector.user;
  const municipalities = [{ name: userMunicipality }];

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextState = { ...state };
    nextState[name] = value;
    setState(nextState);
  };

  const handleRadioChange = (event) => {
    const { name, value } = event.currentTarget;
    const nextState = { ...state };
    nextState[name] = parseInt(value, 10);
    setState(nextState);
  };

  // fetch metadata types
  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch('/api/metadataType');
        const { status, ok } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const receivedMetadataTypes = await res.json();
        setMetadataTypes(receivedMetadataTypes);
      } catch (err) {
        dispatch(alertActions.error('Failed to fetch metadata types'));
      }
    };
    internal();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { token } = userSelector.user;

    const newState = { ...state };

    if (newState.releaseState === 4 && (!newState.url || newState.url === '')) {
      newState.url = null;
    }

    try {
      const res = await fetch('/api/Metadata', {
        method: 'PUT',
        body: JSON.stringify(newState),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      // assuming that any successful response is a JSON object
      const { status, ok } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      setSubmissionStatus('success');
    } catch (err) {
      dispatch(alertActions.error('Failed to post dataset'));
    }
  };

  if (submissionStatus === 'success') {
    return <Redirect to="/viewData" />;
  }

  const {
    metadataTypeName, releaseState, description, formatName, municipalityName, url,
  } = state;

  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit}>
        <Select name="metadataTypeName" value={metadataTypeName} onChange={handleChange} required>
          <option value="" disabled>Metadata type</option>
          {metadataTypes.map(({ name }) => <option key={name} value={name}>{name}</option>)}
        </Select>
        <p>
          Are none of these types appropriate?
          {' '}
          <Link to="/newMetadataType">
            <b>Create a new one</b>
          </Link>
        </p>
        <HorizontalWrapper>
          <RadioLabel htmlFor="bluelight" background="#9999dd" border="#6666aa">
            <Input
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
            <Input
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
          <RadioLabel htmlFor="yellowlight" background="#ffffcc" border="#ffff00">
            <Input
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
            <Input
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
        <TextArea placeholder="description" name="description" value={description} onChange={handleChange} required />
        <Select name="formatName" value={formatName} onChange={handleChange} required>
          <option value="" disabled>Data format</option>
          {dataFormats.map((format) => <option key={format} value={format}>{format}</option>)}
        </Select>
        <Select name="municipalityName" value={municipalityName} onChange={handleChange} required>
          <option value="" disabled>Municipality</option>
          {
            municipalities.map(({ name }) => (<option key={name} value={name}>{name}</option>))
          }
        </Select>
        <Input type="text" placeholder="url to dataset" name="url" value={url} onChange={handleChange} required={releaseState !== 4} />
        <Input type="submit" value="Submit" />
      </StyledForm>
    </Wrapper>
  );
};
