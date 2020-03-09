import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
`;

const HorizontalWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

export const SearchBody = () => {
  const searchField = useRef('');
  const [query, setQuery] = useState('');
  const [metadatas, setMetadatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/Metadata');
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const receivedMetadatas = await res.json();
        const filteredMetadatas = receivedMetadatas
          .filter(({ description }) => description.toLowerCase().includes(query.toLowerCase()));
        setMetadatas(filteredMetadatas);
        setLoading(false);
      } catch (err) {
        dispatch(alertActions.error('Something went wrong'));
      }
    };
    internal();
  }, [query]);

  return (
    <Wrapper>
      <HorizontalWrapper>
        <input type="text" placeholder="Search" ref={searchField} />
        <button type="button" onClick={() => setQuery(searchField.current.value)}>Search</button>
      </HorizontalWrapper>
      {loading ? (
        <h2>Loading...</h2>
      ) : metadatas.map((data) => (
        <SingleMetaDataResult key={data.uuid} metadata={data} showMunicipality showCategory />
      ))}
    </Wrapper>
  );
};
