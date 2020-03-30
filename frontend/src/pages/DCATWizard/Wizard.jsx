import React, { useEffect, useContext } from 'react';
import styled from 'styled-components';
// import { useDispatch, useSelector } from 'react-redux';

import { WizardContext } from './Context';
import { Template } from '../../sharedComponents/Template';
import { TabView } from './TabView';
import { FileDropper } from './FileDropper';
import { DatasetsSelection } from './DatasetsSelection';
import { CatalogsSelection } from './CatalogsSelection';
import parseJsonld from '../../lib/dcat-ld';
// import { alertActions } from '../../state/actions/alert';

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
  height: 95%;
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

const Wizard = () => {
  // Redux
  // const dispatch = useDispatch();
  // const userSelector = useSelector((state) => state.user) || { user: { token: null } };
  // const { token } = userSelector.user;

  // State
  const { state, dispatch } = useContext(WizardContext);

  useEffect(() => {
    if (state.file) {
      const reader = new FileReader();
      reader.readAsText(state.file, 'UTF-8');
      reader.onload = (event) => {
        const object = JSON.parse(event.target.result);
        dispatch({ type: 'addFileContent', payload: object });
      };
      reader.onerror = () => {
        dispatch({ type: 'addFileContent', payload: null });
      };
    }
  }, [state.file]);

  useEffect(() => {
    if (!state.fileContent) return;
    const result = parseJsonld(state.fileContent);
    const datasetsSelections = new Map();
    const datasetsArray = [];
    const catalogsArray = [];

    // Set datasets
    for (const [key, value] of Object.entries(result.datasets)) {
      const dataset = value;
      dataset.id = key;
      datasetsArray.push(dataset);
    }

    // Set catalog
    for (const [key, value] of Object.entries(result.catalogs)) {
      const catalog = value;
      catalog.id = key;
      catalogsArray.push(catalog);
    }

    // Set datasets selections
    datasetsArray.forEach((dataset) => {
      datasetsSelections.set(dataset.title, new Array(dataset.distributions.length).fill(true));
    });

    dispatch({
      type: 'addDatasets',
      payload: {
        datasets: datasetsArray,
        selections: datasetsSelections,
      },
    });

    dispatch({
      type: 'addCatalogs',
      payload: {
        catalogs: catalogsArray,
        selections: new Array(catalogsArray.length).fill(false),
      },
    });
  }, [state.fileContent]);

  return (
    <Template>
      <Wrapper>
        <Content>
          <Uploader>
            <TabView tabs={['Upload File', 'DCAT Datasets', 'DCAT Catalogs']} FBDisabled={state.file === null} BBDisabled={state.file == null}>
              <FileDropper hidden={state.file != null} />
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
  Wizard,
};
