import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';

import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
import { useGetTags } from '../../sharedComponents/hooks/GetTags';
import { useGetValidMunicipalities } from '../../sharedComponents/hooks/GetValidMunicipalities';
import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  flex-direction: column;
`;

const SearchBar = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  & > * {
    margin-right: 0.3em;
  }
`;

const Select = styled(Multiselect)`
  & > .rw-widget-picker > div {
    display: flex;
    align-items: center;
    & > ul > li {
      margin-top: 0px;
    }
  }
`;

export const SearchBody = () => {
  const searchField = useRef('');
  const [query, setQuery] = useState({
    description: '',
    tags: [],
    municipalities: [],
  });
  const [tags, setTags] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [metadatas, setMetadatas] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const allTags = useGetTags() || [];
  const allMunicipalities = useGetValidMunicipalities() || [];
  const allMunicipalityNames = allMunicipalities.map(({ name }) => name);


  const updateQueries = () => {
    setQuery({
      description: searchField.current.value,
      tags,
      municipalities,
    });
  };

  useEffect(() => {
    const internal = async () => {
      // TODO: do this filtering backend rather than frontend
      // TODO: add tags into filtering
      const {
        description: queryDescription,
        // tags: queryTags, - currently not used since tags are not loaded in this
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
        const filteredMetadatas = receivedMetadatas
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
        dispatch(alertActions.error('Something went wrong'));
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
      <SearchBar>
        <input type="text" placeholder="Search" ref={searchField} />
        <Select data={allTags} value={tags} onChange={setTags} placeholder="Tags" />
        <Select
          data={allMunicipalityNames}
          value={municipalities}
          onChange={setMunicipalities}
          placeholder="Municipalities"
        />
        <button type="button" onClick={updateQueries}>
          Search
        </button>
      </SearchBar>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        metadataList
      )}
    </Wrapper>
  );
};
