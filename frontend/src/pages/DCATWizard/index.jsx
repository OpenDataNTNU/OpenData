import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';

import { Template } from '../../sharedComponents/Template';
import { TabView } from './TabView';
import { FileDropper } from './FileDropper';
import { DatasetsSelection } from './DatasetsSelection';
import { CatalogsSelection } from './CatalogsSelection';
import parseJsonld from '../../lib/dcat-ld';
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
  const [fileContent, setFileContent] = useState(null);
  const [FBDisabled, setFBDisabled] = useState(true);
  const [BBDisabled, setBBDisabled] = useState(true);
  const [datasetsState, setDatasetsState] = useState({});
  const [catalogsState, setCatalogsState] = useState({});

  useEffect(() => {
    setFBDisabled(file === null);
    setBBDisabled(file == null);
    if (file) {
      let reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = function (event) {
          let object = JSON.parse(event.target.result)
          setFileContent(object);
      }
      reader.onerror = function (event) {
          setFileContent(null);
      }
    }
  }, [file]);

  useEffect(() => {
    if(!fileContent) return;
    let result = parseJsonld(fileContent);
    let datasetsArray = Object.values(result.datasets);
    setDatasetsState({
      datasets: datasetsArray,
      selections: new Array(datasetsArray.length).fill(true)
    });
  }, [fileContent]);

  return (
    <Template>
      <Wrapper>
        <Content>
          <Uploader>
            <TabView tabs={['Upload File', 'DCAT Datasets', 'DCAT Catalogs']} FBDisabled={FBDisabled} BBDisabled={BBDisabled}>
              <FileDropper file={file} setFile={setFile} hidden={file != null} />
              <DatasetsSelection state={datasetsState} setState={setDatasetsState} />
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
