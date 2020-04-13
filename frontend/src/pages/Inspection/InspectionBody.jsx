import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { MetaData } from './MetaData';
import { alertActions } from '../../state/actions/alert';
import { Comments } from './Comments';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  background-color: #f5f5f5;
`;

export const InspectionBody = ({ id }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/Metadata/${id}`);
        const { status, ok } = res;
        if (status === 200) {
          const receivedData = await res.json();
          setData(receivedData);
        }
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not find the requested dataset.'));
        } else {
          dispatch(alertActions.error('Failed to fetch this data. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, [id]);

  const removeDataSource = (uuidToDelete) => {
    const { dataSource } = data;
    const newDatasources = dataSource.filter(({ uuid }) => uuid !== uuidToDelete);
    setData({
      ...data,
      dataSource: newDatasources,
    });
  };

  if (loading || !data) {
    return (
      <Wrapper>
        <p>Loading entry ...</p>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <MetaData data={data} removeDataSource={removeDataSource} />
      <Comments id={id} />
    </Wrapper>
  );
};

InspectionBody.propTypes = {
  id: PropTypes.string.isRequired,
};
