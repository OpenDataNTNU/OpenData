import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { Template } from '../../sharedComponents/Template';
import { FileDropper } from './FileDropper';
import { alertActions } from '../../state/actions/alert';
// import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: #efefef;
`;

const Content = styled.div`
  width: 80%;
  height: 80%;
  min-width: 500px;
  min-height: 300px;
  background-color: #ffffff;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 40% 60%;
`;

const Uploader = styled.div`
  padding: 20px;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
`;

const Header = styled.h2`

`;

const DCATWizard = () => {
  // Redux
  const dispatch = useDispatch();
  const userSelector = useSelector((state) => state.user) || { user: { token: null } };
  const { token } = userSelector.user;

  const uploadFile = async (file) => {
    const filename = file.type || file.name.split('.').pop();
    let contentType;
    switch (filename) {
      case 'text/xml':
      case 'xml': {
        contentType = 'application/xml';
        break;
      }
      case 'application/ld+json':
      case 'jsonld': {
        contentType = 'application/ld+json';
        break;
      }
      case 'application/rdf+xml':
      case 'rdf': {
        contentType = 'application/rdf+xml';
        break;
      }
      default: {
        return;
      }
    }

    try {
      const response = await fetch('/api/something', {
        method: 'PUT',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': contentType,
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: file,
      });

      if (response.ok && response.status === 200) {
        dispatch(alertActions.success('placeholder'));
      } else {
        throw Error('Failed to upload file');
      }
    } catch (_) {
      dispatch(alertActions.error('Failed to upload file'));
    }
  };

  return (
    <Template>
      <Wrapper>
        <Content>
          <Uploader>
            <Header>DCAT Wizard</Header>
            <FileDropper uploadFile={uploadFile} />
          </Uploader>
        </Content>
      </Wrapper>
    </Template>
  );
};

export {
  DCATWizard,
};
