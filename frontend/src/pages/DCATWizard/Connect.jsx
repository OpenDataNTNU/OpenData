import React, { useState, useContext, useEffect } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import { ConnectSet } from './ConnectSet';

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

  const [metadataTypes, setMetadataTypes] = useState([]);

  const selectedCatalogs = state.catalogsState.catalogs.filter((catalog) => (
    state.catalogsState.selections.get(catalog.title)
  ));

  // filter out the selected datasets
  const selectedDatasets = state.datasetsState.datasets.filter((dataset) => (
    state.datasetsState.selections.get(dataset.id)
  ));

  // Reduce the amount of datasets that are shown at once
  const [showCount, setShowCount] = useState(10);
  const reducedDatasets = selectedDatasets.slice(0, showCount);

  const getMetadataTypes = async () => {
    const url = '/api/MetadataType';
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });

      // Check that the response was ok with status code 200
      if (response.ok && response.status === 200) {
        // Get json data
        const MetadataTypes = await response.json();
        return setMetadataTypes(MetadataTypes);
      }
      return setMetadataTypes([]);
    } catch (_) {
      return setMetadataTypes([]);
    }
  };

  useEffect(() => {
    const init = async () => {
      await getMetadataTypes();
    };
    init();
  }, []);

  const onClick = () => {
    setShowCount(showCount + Math.min(10, state.datasetsState.datasets.length - showCount));
  };

  const onSelect = (id, catalog) => {
    const newDatasetCatalogConnections = new Map(state.datasetCatalogConnection);

    newDatasetCatalogConnections.set(id, catalog);

    dispatch({
      type: 'addDatasetCatalogConnection',
      payload: newDatasetCatalogConnections,
    });
  };

  return (
    <Wrapper>
      <p>
        Datasets left to assign metadataType:
        {' '}
        { selectedDatasets.length - state.datasetCatalogConnection.size}
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
              selectOptions={
                (
                  metadataTypes.map((metadataType) => (
                    [metadataType.name, metadataType.uuid]
                  ))).concat(selectedCatalogs.map((catalog) => [catalog.title, catalog.title]))
              }
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
};

export {
  Connect,
};
