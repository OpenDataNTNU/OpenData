import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { alertActions } from '../../state/actions/alert';


const Input = styled.input`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  flex: 0 0 2em;
  margin-bottom: 5px;
  font-size: 16px;
`;

export const DataSourceForm = ({ dataFormats, addDataSource }) => {
  const [currentSource, setCurrentSource] = useState({
    url: '',
    formatName: '',
    formatDescription: '',
    dataFormatMimeType: '',
    startDate: '',
    endDate: '',
  });

  const dispatch = useDispatch();

  const handleFormatChange = (event) => {
    const { name, value } = event.target;
    const nextFormat = { ...currentSource };
    nextFormat[name] = value;
    setCurrentSource(nextFormat);
  };

  const submit = () => {
    const {
      url,
      formatDescription,
      dataFormatMimeType,
      startDate,
      endDate,
    } = currentSource;
    if (dataFormatMimeType === '') {
      dispatch(alertActions.error('Please choose a data format'));
      return;
    }
    if (url === '') {
      dispatch(alertActions.error('Please supply a URL'));
      return;
    }
    if (formatDescription === '') {
      dispatch(alertActions.error('Please supply a description'));
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      dispatch(alertActions.error('Start date can\'t be after end date'));
      return;
    }
    addDataSource(currentSource);
    setCurrentSource({
      url: '',
      formatName: '',
      formatDescription: '',
      dataFormatMimeType: '',
      startDate: '',
      endDate: '',
    });
  };

  const {
    url,
    formatDescription,
    dataFormatMimeType,
    startDate,
    endDate,
  } = currentSource;

  return (
    <>
      <Select name="dataFormatMimeType" value={dataFormatMimeType} onChange={handleFormatChange}>
        <option value="" disabled>Data format</option>
        {dataFormats.map(({ mimeType }) => (
          <option key={mimeType} value={mimeType}>{mimeType}</option>
        ))}
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
      <button type="button" onClick={submit}>Add source</button>
    </>
  );
};

DataSourceForm.propTypes = {
  dataFormats: PropTypes.arrayOf(PropTypes.shape({
    mimeType: PropTypes.string.isRequired,
  })).isRequired,
  addDataSource: PropTypes.func.isRequired,
};
