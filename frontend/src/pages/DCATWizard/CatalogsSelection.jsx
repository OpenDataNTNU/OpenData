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

  const onSelection = (title) => {
    const newSelections = new Map(state.catalogsState.selections);
    newSelections.set(title, !newSelections.get(title));

    dispatch({
      type: 'selectCatalog',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onSelectAll = () => {
    const newSelections = new Map(state.catalogsState.selections);

    newSelections.forEach((_, key) => {
      newSelections.set(key, true);
    });

    dispatch({
      type: 'selectAllCatalogs',
      payload: {
        selections: newSelections,
      },
    });
  };

  const onDeselectAll = () => {
    const newSelections = new Map(state.catalogsState.selections);

    newSelections.forEach((_, key) => {
      newSelections.set(key, false);
    });

    dispatch({
      type: 'deselectAllCatalogs',
      payload: {
        selections: newSelections,
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
            && reducedCatalogs.map((catalog) => (
              <Catalog
                key={catalog.title}
                selected={state.catalogsState.selections.get(catalog.title)}
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
