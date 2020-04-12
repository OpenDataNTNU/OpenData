import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';

import { Template } from '../../sharedComponents/Template';
import { TabView } from './TabView';
import { FileDropper } from './FileDropper';
import { DatasetsSelection } from './DatasetsSelection';
import { CatalogsSelection } from './CatalogsSelection';
// import { alertActions } from '../../state/actions/alert';
// import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background-color: #efefef;
`;

const Content = styled.div`
  width: 90%;
  height: 80%;
  min-width: 40px;
  max-width: 800px;
  min-height: 300px;
  background-color: #ffffff;
  box-shadow: 0 0.0625em 0.125em rgba(0,0,0,0.15);
  display: flex;
`;

const Uploader = styled.div`
  padding: 20px;
  box-sizing: content-box;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Header = styled.h2`

`;

const DCATWizard = () => {
  // Redux
  // const dispatch = useDispatch();
  // const userSelector = useSelector((state) => state.user) || { user: { token: null } };
  // const { token } = userSelector.user;

  // State
  const [file, setFile] = useState(null);

  useEffect(() => {

  }, [file]);

  return (
    <Template>
      <Wrapper>
        <Content>
          <Uploader>
            <TabView tabs={['Upload File', 'DCAT Datasets', 'DCAT Catalogs']}>
              <FileDropper file={file} setFile={setFile} hidden={file != null} />
              <DatasetsSelection />
              <CatalogsSelection />
            </TabView>
          </Uploader>
        </Content>
      </Wrapper>
    </Template>
  );
};

export {
  DCATWizard,
};
