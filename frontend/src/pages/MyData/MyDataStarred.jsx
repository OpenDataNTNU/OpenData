import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';
import { NoResult } from '../MetadataByMunicipality/NoResult';

const MyDataStarredBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #272727;
  & h2 {
    margin: 0.5rem 0;
  }
`;

const MyDataStarred = () => {
  const [starredData, setStarredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { user: { token } } = userSelector;

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        // TODO: Fetch with a dedicated API call
        const res = await fetch('/api/Metadata');
        if (res.status === 200) {
          const receivedMetadataSet = await res.json();
          const likeResPromises = receivedMetadataSet.map(async (m) => {
            const r = await fetch(`/api/Metadata/${m.uuid}/like`, {
              method: 'GET',
              headers: {
                Authorization: `bearer ${token}`,
              },
            });
            return r.json();
          });
          const likeResponses = await Promise.all(likeResPromises);
          const likedMetadata = receivedMetadataSet.filter((_, i) => likeResponses[i].liked);
          setStarredData(likedMetadata);
        } else {
          const err = new Error();
          err.status = res.status;
          throw err;
        }
      } catch (error) {
        if (error.status === 404) {
          dispatch(alertActions.error('The server responded with a 404 when attempting to fetch data.'));
        } else {
          dispatch(alertActions.error('Failed to fetch data. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, []);

  if (loading) {
    return (
      <MyDataStarredBodyWrapper>
        <NoResult text="Loading" />
      </MyDataStarredBodyWrapper>
    );
  }

  return (
    <MyDataStarredBodyWrapper>
      <h2>Starred data</h2>
      { starredData.length === 0
        ? <p>You do not seem to have any starred data sets.</p>
        : starredData.map((m) => (
          <SingleMetaDataResult key={m.uuid} metadata={m} showMunicipality showCategory />
        ))}
    </MyDataStarredBodyWrapper>
  );
};

export {
  MyDataStarred,
};
