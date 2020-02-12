import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const OuterWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Types = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
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
      <h1>All datasets</h1>
      <Types>
        <ul>
          {metadataTypes.map(({ name }) => (
            <li key={name}>
              <a href={`/viewData/dataType/${name}`}>
                {name}
              </a>
            </li>
          ))}
        </ul>
      </Types>
    </OuterWrapper>
  );
};
