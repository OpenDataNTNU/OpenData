import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { WizardContext } from './Context';
import { Catalog } from './Catalog';

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const Catalogs = styled.div`
  padding: 5px;
  overflow: auto;
  flex: 1;
`;

const Selection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const SelectButton = styled.button`

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


const CatalogsSelection = () => {
  // State
  const { state, dispatch } = useContext(WizardContext);

  // Local state
  const [showCount, setShowCount] = useState(10);
  const reducedCatalogs = state.catalogsState
    ? state.catalogsState.catalogs.slice(0, showCount)
    : [];

  const onClick = () => {
    setShowCount(showCount + Math.min(10, state.catalogsState.catalogs.length - showCount));
  };

  const onSelection = (index) => {
    const newSelections = Array.from(state.catalogsState.selections);
    newSelections[index] = !newSelections[index];

    dispatch({
      type: 'selectCatalog',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onSelectAll = () => {
    dispatch({
      type: 'selectAllCatalogs',
      payload: {
        selections: new Array(state.catalogsState.catalogs.length).fill(true),
      },
    });
  };

  const onDeselectAll = () => {
    dispatch({
      type: 'deselectAllCatalogs',
      payload: {
        selections: new Array(state.catalogsState.catalogs.length).fill(false),
      },
    });
  };

  return (
    <Wrapper>
      <Selection>
        <span>Catalogs to import:</span>
        <div>
          <SelectButton onClick={onSelectAll}>Select All</SelectButton>
          <SelectButton onClick={onDeselectAll}>Deselect All</SelectButton>
        </div>
      </Selection>
      <Catalogs>
        {
            reducedCatalogs
            && reducedCatalogs.map((catalog, index) => (
              <Catalog
                index={index}
                selected={state.catalogsState.selections[index]}
                onSelect={onSelection}
                title={catalog.title}
              />
            ))
        }
      </Catalogs>
      <LoadMoreButton onClick={onClick}>
        {' '}
        Load more (
        {state.catalogsState ? state.catalogsState.catalogs.length - showCount : 0}
        )
        {' '}
      </LoadMoreButton>
    </Wrapper>
  );
};

export {
  CatalogsSelection,
};
