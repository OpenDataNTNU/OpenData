import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { MetaData } from './MetaData';
import { alertActions } from '../../state/actions/alert';
// import { Comments } from './Comments';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const InspectionBody = (props) => {
  const { id } = props;
  const [data, setData] = useState({
    uuid: id,
    url: '',
    formatName: '',
    releaseState: 0,
    metadataTypeName: '',
    municipalityName: '',
  });
  // const [comments, setComments] = useState([]);
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch(`/api/metadata/${id}`);
        const { status, ok } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const municipality = await res.json();
        setData(municipality);
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error('Could not find the requested dataset.'));
        } else {
          dispatch(alertActions.error('Failed to fetch this data. Please try again later.'));
        }
      }

      // get received comments when this is implemented backend
      /*
      setComments([{
        id: 1,
        comment: 'Beautiful comment',
        author: 'Michael Bay',
        date: '19-02-2019',
      },
      {
        id: 2,
        comment: 'Harsh comment',
        author: 'Sharknado',
        date: '23-07-2019',
      }]);
      */
    };
    internal();
  }, [id]);

  useEffect(() => {
    const { metadataTypeName: name } = data;
    if (name) {
      const internal = async () => {
        try {
          const res = await fetch(`/api/MetadataType/${name}`);
          const { ok } = res;
          if (!ok) {
            throw new Error();
          }
          const { tags: receivedTags, description: receivedDescription } = await res.json();
          const tagNames = receivedTags.map(({ tagName }) => tagName);
          setTags(tagNames);
          setDescription(receivedDescription);
        } catch (err) {
          dispatch(alertActions.error('Failed to fetch information about the category'));
        }
      };
      internal();
    }
  }, [data]);

  return (
    <Wrapper>
      <MetaData data={data} description={description} tags={tags} />
      {/* <Comments comments={comments} /> */}
    </Wrapper>
  );
};

InspectionBody.propTypes = {
  id: PropTypes.string.isRequired,
};
