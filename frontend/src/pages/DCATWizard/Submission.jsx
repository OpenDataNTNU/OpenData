import React, { useContext } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import { FinalizedDataset } from './FinalizedDataset';
import { LoadingButton } from '../../sharedComponents/LoadingButton';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Datasets = styled.div`
  padding: 5px;
  overflow: auto;
  flex: 1;
`;

const Submission = () => {
  const { state, dispatch } = useContext(WizardContext);

  // filter out the selected catalogs
  const selectedCatalogs = state.catalogsState.catalogs.filter((catalog) => (
    state.catalogsState.selections.get(catalog.title)
  ));

  // filter out the selected datasets
  const selectedDatasets = state.datasetsState.datasets.filter((dataset) => (
    state.datasetsState.selections.get(dataset.id)
  ));

  const onSubmit = () => {
    alert("lol, jebaited. Not implemented yet");
  }

  return (
    <Wrapper>
      <Datasets>
        {
          selectedDatasets && selectedDatasets.map(({ id, title, distributions }) => (
            <FinalizedDataset
              key={id}
              id={id}
              title={title}
              distributions={distributions}
              metadataType={state.datasetCatalogConnection.get(id)}
              />
          ))
        }
      </Datasets>
      <LoadingButton text="Submit Datasets and Catalogs" onClick={onSubmit} />
    </Wrapper>
  );
};

export {
  Submission
}