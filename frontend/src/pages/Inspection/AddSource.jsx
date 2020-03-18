import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  margin: 1.5em 0 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin: 0 0 1.5em;
`;

export const AddSource = ({ addSource, uuid }) => {
  const dataFormats = ['JSON', 'CSV'];

  const [expand, setExpand] = useState(false);
  const [format, setFormat] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const userSelector = useSelector(({ user }) => user);
  const { token } = userSelector.user;

  const dispatch = useDispatch();

  const submit = async (e) => {
    e.preventDefault();
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      dispatch(alertActions.error('Start date can\'t be after end date'));
      return;
    }
    try {
      const res = await fetch('/api/Metadata/url', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `bearer ${token}`,
        },
        body: JSON.stringify({
          metadataUuid: uuid,
          url,
          description,
          dataFormatName: format,
          startDate: (startDate !== '' ? startDate : undefined),
          endDate: (endDate !== '' ? endDate : undefined),
        }),
      });
      const { ok, status } = res;
      if (!ok) {
        const err = new Error();
        err.status = status;
        throw err;
      }
      // TODO: use the response body rather than making up a time-based uuid
      // (requires backend to supply it)
      const receivedSource = await res.json();
      addSource(receivedSource);
      setFormat('');
      setUrl('');
      setDescription('');
      setStartDate('');
      setEndDate('');
    } catch (err) {
      dispatch(alertActions.error('Something went wrong while trying to add this data source'));
    }
  };

  if (expand) {
    return (
      <Wrapper>
        <Form onSubmit={submit}>
          <select name="dataFormatName" value={format} onChange={(e) => setFormat(e.target.value)} required>
            <option value="" disabled>Data format</option>
            {dataFormats.map((name) => <option key={name} value={name}>{name}</option>)}
          </select>
          <input type="text" placeholder="Url to dataset" value={url} onChange={(e) => setUrl(e.target.value)} required />
          <input type="text" placeholder="Description of source" value={description} onChange={(e) => setDescription(e.target.value)} />
          <label htmlFor="dateFrom">
            Start date:
            <input id="dateFrom" type="date" placeholder="From" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </label>
          <label htmlFor="dateTo">
            End date:
            <input id="dateTo" type="date" placeholder="To" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </label>
          <input type="submit" value="Submit" />
        </Form>
        <button type="button" onClick={() => setExpand(false)}>
          I am done
        </button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <button type="button" onClick={() => setExpand(true)}>
        Add more sources
      </button>
    </Wrapper>
  );
};

AddSource.propTypes = {
  addSource: PropTypes.func.isRequired,
  uuid: PropTypes.string.isRequired,
};
