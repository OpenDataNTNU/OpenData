import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { alertActions } from '../../state/actions/alert';
import { MyDataCrossRefType } from './MyDataCrossRefType';
import { NoResult } from '../MetadataByMunicipality/NoResult';

const Wrapper = styled.div`
  flex: 1;
  color: #272727;
  & h2 {
    margin: 0.5rem 0;
  }
`;

const MyDataCrossRef = () => {
  const [datatypes, setDatatypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user);
  const { municipalityName } = userSelector.user;

  useEffect(() => {
    const internal = async () => {
      try {
        const res = await fetch('/api/MetadataType');
        const { ok, status } = res;
        if (!ok) {
          const err = new Error();
          err.status = status;
          throw err;
        }
        const types = await res.json();
        // fetch all types with
        const allTypes = await Promise.all(types.map(async ({ uuid }) => {
          try {
            const dataRes = await fetch(`api/MetadataType/${uuid}`);
            const { ok: dataOk, status: dataStatus } = dataRes;
            if (!dataOk) {
              const err = new Error();
              err.status = dataStatus;
              throw err;
            }
            const result = await dataRes.json();
            return result;
          } catch (err) {
            dispatch(alertActions.error('Something went wrong while fetching metadata sets'));
            return { metadataList: [] };
          }
        }));
        const myTypes = allTypes.filter(({ metadataList }) => (
          metadataList.find((metadata) => metadata.municipalityName === municipalityName)));

        setDatatypes(myTypes);
      } catch (err) {
        dispatch(alertActions.error('Something went wrong while fetching data from the server'));
      }
      setLoading(false);
    };
    internal();
  }, [municipalityName]);
  if (loading) {
    return (
      <Wrapper>
        <NoResult text="Loading" />
      </Wrapper>
    );
  }
  return (
    <Wrapper>
      <h2>Other municipalities who offer my datasets</h2>
      {datatypes.length > 0 ? datatypes.map((datatype) => (
        <MyDataCrossRefType key={datatype.name} datatype={datatype} />
      )) : <p>There are no data sets to display.</p>}
    </Wrapper>
  );
};

export {
  MyDataCrossRef,
};
