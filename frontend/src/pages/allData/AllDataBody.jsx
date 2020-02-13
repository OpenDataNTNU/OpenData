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

const Type = styled.div`
  max-width: 60em;
  border: solid 0.2em #f0f0f0;
  border-radius: 0.2em;
  padding: 0.5em;
  margin-bottom: 0.5em;
  display: flex;
  flex-direction: column;
`;

const Tags = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const Tag = styled.div`
  background-color: #eeeeee;
  color: #595959;
  font-size: 0.9em;
  padding: 0.1em 0.7em;
  display: inline-block;
  border-radius: 1em;
  margin: 0.3em;
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
        <div>
          {metadataTypes.map(({ name, tags, description }) => (
            <Type key={name}>
              <a href={`/viewData/dataType/${name}`}>
                <h3>
                  {name}
                </h3>
              </a>
              <p>
                {description}
              </p>
              <Tags>
                {tags.map(({ tagName }) => (
                  <Tag key={tagName}>{tagName}</Tag>
                ))}
              </Tags>
            </Type>
          ))}
        </div>
      </Types>
    </OuterWrapper>
  );
};
