import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import { Dataset } from './Dataset';

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

  const onSelection = (id) => {
    const newSelections = new Map(state.datasetsState.selections);
    newSelections.set(id, !newSelections.get(id));

    dispatch({
      type: 'newSelection',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onSelectAll = () => {
    const newSelections = new Map(state.datasetsState.selections);

    newSelections.forEach((_, key) => {
      newSelections.set(key, true);
    });

    dispatch({
      type: 'selectAllDatasets',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onDeselectAll = () => {
    const newSelections = new Map(state.datasetsState.selections);

    newSelections.forEach((_, key) => {
      newSelections.set(key, false);
    });

    dispatch({
      type: 'deselectAllDatasets',
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
          reducedDatasets && reducedDatasets.map(({ id, title, distributions }) => (
            <Dataset
              key={title}
              selected={state.datasetsState ? state.datasetsState.selections.get(id) : false}
              onSelection={onSelection}
              id={id}
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
