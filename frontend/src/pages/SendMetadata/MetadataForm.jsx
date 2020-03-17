import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { alertActions } from '../../state/actions/alert';
import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-content: space-around;
  max-width: 50em;
  min-width: 20em;
  padding: 1em;
  margin: 10px 0px;
  background-color: white;
  border-radius: 4px;
  -webkit-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  -moz-box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
`;

const NewMetadataType = styled.p`
  margin: 0px 0px 10px 0px;
`;

const Input = styled.input`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
`;

const Radio = styled.input.attrs({ type: 'radio' })`
  margin: 0px 5px 0px 0px;
`;

const Select = styled.select`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  min-height: 150px;
  resize: vertical;
  margin-bottom: 5px;
  font-size: 16px;
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
    dataSource: [],
    municipalityName: '',
  });

  const [dataFormat, setDataFormat] = useState({
    url: '',
    formatName: '',
    formatDescription: '',
    dataFormatName: '',
    startDate: '',
    endDate: '',
  });

  const [loading, setLoading] = useState(false);

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

  const handleFormatChange = (event) => {
    const { name, value } = event.target;
    const nextFormat = { ...dataFormat };
    nextFormat[name] = value;
    setDataFormat(nextFormat);
  };

  const addDataSource = () => {
    // appends dataFormat at the end of dataSource
    const { dataSource } = state;
    const {
      url,
      formatDescription,
      dataFormatName,
      startDate,
      endDate,
    } = dataFormat;
    if (url && dataFormatName && formatDescription && startDate && endDate) {
      setState({
        ...state,
        dataSource: [...dataSource, dataFormat],
      });
      setDataFormat({
        url: '',
        formatName: '',
        formatDescription: '',
        dataFormatName: '',
        startDate: '',
        endDate: '',
      });
    }
  };

  const removeDataSource = (index) => {
    const { dataSource } = state;
    const pre = dataSource.slice(0, index);
    const post = dataSource.slice(index + 1);
    setState({
      ...state,
      dataSource: [...pre, ...post],
    });
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
    setLoading(true);
    const { token } = userSelector.user;

    const {
      metadataTypeName,
      releaseState,
      description,
      dataSource,
      municipalityName,
    } = state;

    try {
      const res = await fetch('/api/Metadata', {
        method: 'PUT',
        body: JSON.stringify({
          metadataTypeName,
          releaseState,
          description,
          municipalityName,
        }),
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
      const { uuid } = await res.json();
      const sourceReses = await Promise.all(dataSource.map((source) => {
        const {
          url, dataFormatName, formatDescription, startDate, endDate,
        } = source;
        return fetch('/api/Metadata/url', {
          method: 'PUT',
          body: JSON.stringify({
            metadataUuid: uuid,
            url,
            description: formatDescription,
            dataFormatName,
            startDate,
            endDate,
          }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `bearer ${token}`,
          },
        });
      }));
      sourceReses.forEach((sourceRes) => {
        const { ok: sourceOk, status: sourceStatus } = sourceRes;
        if (!sourceOk) {
          const err = new Error();
          err.status = sourceStatus;
          throw err;
        }
      });
      setSubmissionStatus('success');
      setLoading(false);
    } catch (err) {
      dispatch(alertActions.error('Failed to post dataset'));
      setLoading(false);
    }
  };

  if (submissionStatus === 'success') {
    return <Redirect to="/" />;
  }

  const {
    metadataTypeName, releaseState, description, municipalityName,
  } = state;

  const {
    url,
    dataFormatName,
    formatDescription,
    startDate,
    endDate,
  } = dataFormat;

  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit}>
        <Select name="metadataTypeName" value={metadataTypeName} onChange={handleChange} required>
          <option value="" disabled>Metadata type</option>
          {metadataTypes.map(({ name }) => <option key={name} value={name}>{name}</option>)}
        </Select>
        <NewMetadataType>
          Are none of these types appropriate?
          {' '}
          <Link to="/newMetadataType">
            <b>Create a new one</b>
          </Link>
        </NewMetadataType>
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
        <TextArea placeholder="Description" name="description" value={description} onChange={handleChange} required />
        <Select name="municipalityName" value={municipalityName} onChange={handleChange} required>
          <option value="" disabled>Municipality</option>
          {
            municipalities.map(({ name }) => (<option key={name} value={name}>{name}</option>))
          }
        </Select>
        <h3>Data sources: </h3>
        <ul>
          {state.dataSource.map((source, i) => {
            const {
              url: sourceUrl,
              dataFormatName: sourceType,
              formatDescription: sourceDesc,
              startDate: sourceStart,
              endDate: sourceEnd,
            } = source;
            return (
              <li key={sourceUrl}>
                {sourceUrl}
                <ul>
                  <li>{sourceDesc}</li>
                  <li>{sourceType}</li>
                  <li>{`${sourceStart} - ${sourceEnd}`}</li>
                  <li>
                    <button type="button" onClick={() => removeDataSource(i)}>Delete</button>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
        <Select name="dataFormatName" value={dataFormatName} onChange={handleFormatChange}>
          <option value="" disabled>Data format</option>
          {dataFormats.map((format) => <option key={format} value={format}>{format}</option>)}
        </Select>
        <Input type="text" placeholder="Url to dataset" name="url" value={url} onChange={handleFormatChange} />
        <Input type="text" placeholder="Description of source" name="formatDescription" value={formatDescription} onChange={handleFormatChange} />
        <label htmlFor="dateFrom">
          Start date:
          <Input id="dateFrom" type="date" placeholder="From" name="startDate" value={startDate} onChange={handleFormatChange} />
        </label>
        <label htmlFor="dateTo">
          End date:
          <Input id="dateTo" type="date" placeholder="To" name="endDate" value={endDate} onChange={handleFormatChange} />
        </label>
        <button type="button" onClick={addDataSource}>Add source</button>
        <LoadingButton text="Submit" type="submit" loading={loading} onClick={() => null} />
      </StyledForm>
    </Wrapper>
  );
};
