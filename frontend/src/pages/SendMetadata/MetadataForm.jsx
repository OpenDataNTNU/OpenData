import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import { alertActions } from '../../state/actions/alert';
import { LoadingButton } from '../../sharedComponents/LoadingButton';
import { useGetFormats } from '../../sharedComponents/hooks/GetFormats';
import { ReleaseStateRadios } from './ReleaseStateRadios';
import { DataSourceForm } from './DataSourceForm';

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

export const MetadataForm = () => {
  const [state, setState] = useState({
    metadataTypeUuid: '',
    releaseState: 1,
    description: '',
    dataSource: [],
    municipalityName: '',
  });

  const [loading, setLoading] = useState(false);

  const [metadataTypes, setMetadataTypes] = useState([]);
  const dataFormats = useGetFormats();

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

  const addDataSource = (dataFormat) => {
    const { dataSource } = state;
    setState({
      ...state,
      dataSource: [...dataSource, dataFormat],
    });
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
      metadataTypeUuid,
      releaseState,
      description,
      dataSource,
      municipalityName,
    } = state;

    try {
      const res = await fetch('/api/Metadata', {
        method: 'PUT',
        body: JSON.stringify({
          metadataTypeUuid,
          releaseState,
          description,
          municipalityName,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
      });
      const { status, ok } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      const { uuid } = await res.json();
      const sourceReses = await Promise.all(dataSource.map((source) => {
        const {
          url, dataFormatMimeType, formatDescription, startDate, endDate,
        } = source;
        return fetch('/api/Metadata/url', {
          method: 'PUT',
          body: JSON.stringify({
            metadataUuid: uuid,
            url,
            description: formatDescription,
            dataFormatMimeType,
            startDate: startDate || undefined,
            endDate: endDate || undefined,
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
    metadataTypeUuid, releaseState, description, municipalityName,
  } = state;

  return (
    <Wrapper>
      <StyledForm onSubmit={handleSubmit}>
        <Select name="metadataTypeUuid" value={metadataTypeUuid} onChange={handleChange} required>
          <option value="" disabled>Metadata type</option>
          {metadataTypes.map(({ name, uuid }) => <option key={uuid} value={uuid}>{name}</option>)}
        </Select>
        <NewMetadataType>
          Are none of these types appropriate?
          {' '}
          <Link to="/newMetadataType">
            <b>Create a new one</b>
          </Link>
        </NewMetadataType>
        <NewMetadataType>
          Already have a data source?
          {' '}
          <Link to="/wizard">
            <b>Import from a DCAT-NO file</b>
          </Link>
          {' or '}
          <Link to="/importCkan">
            <b>Import from CKAN</b>
          </Link>
        </NewMetadataType>
        <ReleaseStateRadios releaseState={releaseState} handleRadioChange={handleRadioChange} />
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
              dataFormatMimeType: sourceMimeType,
              formatDescription: sourceDesc,
              startDate: sourceStart,
              endDate: sourceEnd,
            } = source;
            return (
              <li key={sourceUrl}>
                {sourceUrl}
                <ul>
                  <li>{sourceDesc}</li>
                  <li>{sourceMimeType}</li>
                  <li>{`${sourceStart} - ${sourceEnd}`}</li>
                  <li>
                    <button type="button" onClick={() => removeDataSource(i)}>Delete</button>
                  </li>
                </ul>
              </li>
            );
          })}
        </ul>
        <DataSourceForm dataFormats={dataFormats} addDataSource={addDataSource} />
        <LoadingButton text="Submit" type="submit" loading={loading} onClick={() => null} />
      </StyledForm>
    </Wrapper>
  );
};
