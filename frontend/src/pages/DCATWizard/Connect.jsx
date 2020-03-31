import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import {ConnectSet } from './ConnectSet';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const LoadMoreButton = styled.button`
  padding: 0.3em;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-size: .875rem;
  line-height: 2.25rem;
  font-weight: 500;
  letter-spacing: .0892857143em;
  text-decoration: none;
  border-radius: 0.3em;
  color: #7e6dad;
  background-color: #dcd8ff;
  border: solid 0.1em #9a85d3;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin: 1em 0 0.8em 0;
  cursor: pointer;
  position: relative;
`;

const Datasets = styled.div`
  padding: 5px;
  overflow: auto;
  flex: 1;
`;

const Connect = () => {

  // State
  const { state, dispatch } = useContext(WizardContext);

  const selectedCatalogs = state.catalogsState.catalogs.filter((catalog) => (
    state.catalogsState.selections.get(catalog.title)
  ));
  console.log(selectedCatalogs)

  // filter out the selected datasets
  const selectedDatasets = state.datasetsState.datasets.filter((dataset) => (
    state.datasetsState.selections.get(dataset.id)
  ));

  // Reduce the amount of datasets that are shown at once
  const [showCount, setShowCount] = useState(10);
  const reducedDatasets = selectedDatasets.slice(0, showCount);

  const onClick = () => {
    setShowCount(showCount + Math.min(10, state.datasetsState.datasets.length - showCount));
  };

  const onSelect = (id, catalog) => {
    const newDatasetCatalogConnections = new Map(state.datasetCatalogConnection);

    newDatasetCatalogConnections.set(id, catalog)

    dispatch({
      type: 'addDatasetCatalogConnection',
      payload: newDatasetCatalogConnections
    });
  }

  return (
    <Wrapper>
      <p>
        Datasets left to assign metadataType: { selectedDatasets.length -  state.datasetCatalogConnection.size}
      </p>
      <Datasets>
        {
          reducedDatasets && reducedDatasets.map(({ id, title, distributions }) => (
            <ConnectSet
                key={id}
                id={id}
                title={title}
                distributions={distributions}
                value={state.datasetCatalogConnection.get(id)}
                selectOptions={selectedCatalogs.map((catalog) => catalog.title)}
                onSelect={onSelect}
              />
          ))
        }
      </Datasets>
      <LoadMoreButton onClick={onClick}>
        {' '}
        Load more (
        {selectedDatasets ? Math.max(selectedDatasets.length - showCount, 0) : 0}
        )
        {' '}
      </LoadMoreButton>
    </Wrapper>
  );
}

export {
  Connect,
};
