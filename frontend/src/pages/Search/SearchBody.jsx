import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import 'react-widgets/dist/css/react-widgets.css';

import { SearchBar } from './SearchBar';
import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
`;

export const SearchBody = () => {
  const [query, setQuery] = useState({
    name: '',
    description: '',
    municipalities: [],
  });
  const [metadatas, setMetadatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      // TODO: do this filtering backend rather than frontend
      const {
        name: queryName,
        description: queryDescription,
        municipalities: queryMunicipalities,
      } = query;
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
        const metadataTypeNames = await Promise.all(
          receivedMetadatas.map(async ({ metadataTypeUuid }) => {
            const nameRes = await fetch(`/api/MetadataType/${metadataTypeUuid}`);
            const { ok: nameOk, status: nameStatus } = nameRes;
            if (!nameOk) {
              const err = new Error();
              err.status = nameStatus;
              err.type = 'name';
              throw err;
            }
            const { name } = await nameRes.json();
            return name;
          }),
        );
        const metadatasWithNames = receivedMetadatas.map((data, index) => (
          { metadataTypeName: metadataTypeNames[index], ...data }
        ));
        const filteredMetadatas = metadatasWithNames
          // name should contain a match
          .filter(({ metadataTypeName }) => (
            metadataTypeName.toLowerCase().includes(queryName.toLowerCase())
          ))
          // the description should contain the query
          .filter(({ description }) => (
            description.toLowerCase().includes(queryDescription.toLowerCase())
          ))
          // the municipality should be listed in the query, if any are listed
          .filter(({ municipalityName }) => (
            queryMunicipalities.length === 0 || queryMunicipalities.indexOf(municipalityName) >= 0
          ));
        setMetadatas(filteredMetadatas);
        setLoading(false);
      } catch (err) {
        const { type } = err;
        if (type === 'name') {
          dispatch(alertActions.error('Failed to get type names'));
        } else {
          dispatch(alertActions.error('Something went wrong'));
        }
      }
    };
    internal();
  }, [query]);

  const metadataList = metadatas.length > 0
    ? metadatas.map((data) => (
      <SingleMetaDataResult key={data.uuid} metadata={data} showMunicipality showCategory />
    )) : <h2>No results found for your query</h2>;

  return (
    <Wrapper>
      <SearchBar setQuery={setQuery} />
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        metadataList
      )}
    </Wrapper>
  );
};
