import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { alertActions } from '../../state/actions/alert';

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

  const dispatch = useDispatch();

  // get metadata types
  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch('/api/metadataType');
        const { ok } = res;
        if (!ok) {
          throw new Error();
        }
        const j = await res.json();
        setMetadataTypes(j);
      } catch (err) {
        dispatch(alertActions.error('Failed to fetch metadata categories'));
      }
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
              <Link to={`/dataType/${name}`}>
                <h3>
                  {name}
                </h3>
              </Link>
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
