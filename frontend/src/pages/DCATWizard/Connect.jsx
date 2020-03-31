import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import { Dataset } from './Dataset';

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
  const selectedCatalogs = state.catalogsState.catalogs.reduce((_, index) => (
    state.catalogsState.selections[index]
  ));

  // Flattened selections 
  const flattenedSelections = Array.from(state.datasetsState.selections.values()).flat()
  console.log(flattenedSelections)

  // Mapped from DCAT dataset to our dataset and flattened
  const formatedDatasets = state.datasetsState.datasets.map((dataset) => (
    dataset.distributions
  )).flat();
  console.log(formatedDatasets)

  //
  const selectedDatasets = formatedDatasets.filter((_, index) => (
    flattenedSelections[index]
  ));
  console.log(selectedDatasets)

  const [showCount, setShowCount] = useState(10);
  const reducedDatasets = selectedDatasets.slice(0, showCount);
  console.log(reducedDatasets)

  const onClick = () => {
    setShowCount(showCount + Math.min(10, state.datasetsState.datasets.length - showCount));
  };

  return (
    <Wrapper>
      <Datasets>
        {
          reducedDatasets && reducedDatasets.map(({ format, description, url }, index) => (
            <Dataset
                key={url + description}
                index={index}
                format={format}
                description={description}
                url={url}
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
