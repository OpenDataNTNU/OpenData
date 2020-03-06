import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';

import { alertActions } from '../../state/actions/alert';
import { MyDataDatatype } from './MyDataDatatype';

const Wrapper = styled.div`
  flex: 1;
`;

export const MyDataBody = () => {
  const [datatypes, setDatatypes] = useState([]);

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
        const allTypes = await Promise.all(types.map(async ({ name }) => {
          try {
            const dataRes = await fetch(`api/MetadataType/${name}`);
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
    };
    internal();
  }, [municipalityName]);
  return (
    <Wrapper>
      <h1>Other municipalities who offer my datasets</h1>
      {datatypes.map((datatype) => (
        <MyDataDatatype key={datatype.name} datatype={datatype} />
      ))}
    </Wrapper>
  );
};
