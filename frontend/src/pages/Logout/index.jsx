import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { Template } from '../../sharedComponents/Template';
import { userActions } from '../../state/actions/user';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
  background-color: #f5f5f5;
  height: 100%;
  width: 100%;
`;

const Logout = () => {
  // Redux
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.logout());
  }, []);

  return (
    <Template>
      <Wrapper>
        <h2>Please wait while we log you out.</h2>
      </Wrapper>
    </Template>
  );
};

export {
  Logout,
};
