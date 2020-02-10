import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import { SearchResults } from './SearchResults';

const OuterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Types = styled.div`
  flex: 1;
`;


export const AllDataBody = () => {
  const [metadataTypes, setMetadataTypes] = useState([]);

  // get metadata types
  useEffect(() => {
    const internal = async () => {
      const res = await fetch('/api/metadataType');
      const j = await res.json();
      setMetadataTypes(j);
    };
    internal();
  }, []);

  // get all metadata:
  return (
    <OuterWrapper>
      <Types>
        <ul>
          {metadataTypes.map(({ name }) => <li key={name}>{name}</li>)}
        </ul>
      </Types>
      <SearchResults />
    </OuterWrapper>
  );
};
