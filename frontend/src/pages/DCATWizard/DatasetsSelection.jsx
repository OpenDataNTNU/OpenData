import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import { DCATDataset } from './DCATDataset';

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

const Selection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Datasets = styled.div`
  padding: 5px;
  overflow: auto;
  flex: 1;
`;

const SelectButton = styled.button`

`;

const DatasetsSelection = () => {
  // wizard state
  const { state, dispatch } = useContext(WizardContext);

  const [showCount, setShowCount] = useState(10);
  const reducedDatasets = state.datasetsState
    ? state.datasetsState.datasets.slice(0, showCount)
    : [];

  const onClick = () => {
    setShowCount(showCount + Math.min(10, state.datasetsState.datasets.length - showCount));
  };

  const onSelection = (title, newValues) => {
    const newSelections = new Map(state.datasetsState.selections);
    newSelections.set(title, newValues);

    dispatch({
      type: 'newSelection',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onSelectAll = () => {
    const newSelections = new Map();

    state.datasetsState.selections.forEach((selection, title) => {
      newSelections.set(title, new Array(selection.length).fill(true));
    });

    dispatch({
      type: 'selectAllDatasets',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onDeselectAll = () => {
    const newSelections = new Map();

    state.datasetsState.selections.forEach((selection, title) => {
      newSelections.set(title, new Array(selection.length).fill(false));
    });

    dispatch({
      type: 'selectAllDatasets',
      payload: {
        selections: newSelections,
      },
    });
  };

  return (
    <Wrapper>
      <Selection>
        <span>Datasets to import:</span>
        <div>
          <SelectButton onClick={onSelectAll}>Select All</SelectButton>
          <SelectButton onClick={onDeselectAll}>Deselect All</SelectButton>
        </div>
      </Selection>
      <Datasets>
        {
          reducedDatasets && reducedDatasets.map(({ title, distributions }) => (
            <DCATDataset
              key={title}
              selections={state.datasetsState ? state.datasetsState.selections.get(title) : false}
              onSelection={onSelection}
              title={title}
              distributions={distributions}
            />
          ))
        }
      </Datasets>
      <LoadMoreButton onClick={onClick}>
        {' '}
        Load more (
        {state.datasetsState ? state.datasetsState.datasets.length - showCount : 0}
        )
        {' '}
      </LoadMoreButton>
    </Wrapper>
  );
};

export {
  DatasetsSelection,
};
