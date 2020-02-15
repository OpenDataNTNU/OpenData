import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';


import { alertActions } from '../../state/actions/alert';

const Wrapper = styled.div`
  flex: 1;
  padding: 0.5em;
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

const State = styled.div`
  padding: 0 0.4em;
  background-color: ${({ color }) => color};
`;

const releaseStates = [
  <State color="#9999dd">
    Released
  </State>,
  <State color="#00ff00">
    Ready to release
  </State>,
  <State color="#ffff33">
    Needs work
  </State>,
  <State color="#cc4444">
    Not releasable
  </State>,
];

export const MetadataByTypeBody = ({ name }) => {
  const [metadatas, setMetadatas] = useState([]);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');
  const [search, setSearch] = useState('');

  // redux, for error messages
  const dispatch = useDispatch();

  // get list of municipalities offering the metadata
  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/metadataType/${name}`);
        const { status, ok } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const {
          metadataList, tags: receivedTags, description: receivedDescription,
        } = await res.json();
        const tagNames = receivedTags.map(({ tagName }) => tagName);
        setMetadatas(metadataList);
        setTags(tagNames);
        setDescription(receivedDescription);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not find the dataset you requested.'));
        } else {
          dispatch(alertActions.error('Failed to fetch a list of municipalities offering this dataset. Please try again later.'));
        }
      }
    };
    internal();
  }, [name]);

  return (
    <Wrapper>
      <h1>
        Metadata type:
        {` ${name}`}
      </h1>
      <p>
        {description}
      </p>
      <div>
        {tags.map((tag) => (
          <Tag key={tag}>
            {tag}
          </Tag>
        ))}
      </div>
      <h3>This data set is offered by:</h3>
      <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Release state</th>
          </tr>
        </thead>
        <tbody>
          {metadatas
            .filter(({ municipalityName }) => (
              municipalityName.toLowerCase().includes(search.toLowerCase())
            ))
            .map(({ uuid, municipalityName, releaseState }) => (
              <tr key={uuid}>
                <td>
                  <Link to={`/viewData/dataset/${uuid}`}>
                    {municipalityName}
                  </Link>
                </td>
                <td>
                  {releaseStates[releaseState - 1]}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

MetadataByTypeBody.propTypes = {
  name: PropTypes.string.isRequired,
};
