import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { SingleMetaDataResult } from '../../sharedComponents/Metadata/SingleMetaDataResult';
import { alertActions } from '../../state/actions/alert';
import { NoResult } from '../MetadataByMunicipality/NoResult';

const MyDataSubmittedBodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  color: #272727;
  & h2 {
    margin: 0.5rem 0;
  }
`;

const MyDataSubmitted = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { user: { municipalityName } } = userSelector;

  useEffect(() => {
    const internal = async () => {
      setLoading(true);
      try {
        // TODO: Filter this result within API, not frontend!
        const res = await fetch('/api/Metadata');
        if (res.status === 200) {
          const receivedMetadataSet = await res.json();
          const filteredResult = receivedMetadataSet.filter((m) => (
            m.municipalityName.toLowerCase() === municipalityName.toLowerCase()
          ));
          setSubmittedData(filteredResult);
        }
      } catch (err) {
        const { status } = err;
        if (status === 404) {
          dispatch(alertActions.error(`Could not find the metadata for municipality ${municipalityName}`));
        } else {
          dispatch(alertActions.error('Failed to fetch metadata. Please try again later.'));
        }
      }
      setLoading(false);
    };
    internal();
  }, []);

  if (loading) {
    return (
      <MyDataSubmittedBodyWrapper>
        <NoResult text="Loading" />
      </MyDataSubmittedBodyWrapper>
    );
  }

  return (
    <MyDataSubmittedBodyWrapper>
      <h2>Submitted data</h2>
      <p><i>Displaying data submitted by your municipality.</i></p>
      { submittedData.length === 0
        ? <p>You do not seem to have any submitted data sets.</p>
        : submittedData.map((m) => (
          <SingleMetaDataResult key={m.uuid} metadata={m} showMunicipality showCategory />
        ))}
    </MyDataSubmittedBodyWrapper>
  );
};

export {
  MyDataSubmitted,
};
