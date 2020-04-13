import React, { useState, useContext, useEffect } from 'react';
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
  const [categories, setCategories] = useState([]);

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

  const getCategories = async () => {
    const url = '/api/MetadataCategory';
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
        const Categories = await response.json();

        return setCategories(Categories);
      }
      return setCategories([]);
    } catch (_) {
      return setCategories([]);
    }
  };

  useEffect(() => {
    if (!categories) return;

    const newTypeMap = new Map(state.catalogsState.typeMap);

    state.catalogsState.catalogs.forEach((catalog) => {
      newTypeMap.set(
        catalog.title,
        categories && categories.length > 0 ? categories[0].uuid : null,
      );
    });

    dispatch({
      type: 'selectCatalogType',
      payload: {
        typeMap: newTypeMap,
      },
    });
  }, [categories]);

  useEffect(() => {
    const init = async () => {
      await getCategories();
    };
    init();
  }, []);

  const onCategorySelect = (title, uuid) => {
    const newTypeMap = new Map(state.catalogsState.typeMap);
    newTypeMap.set(title, uuid);

    dispatch({
      type: 'selectCatalogType',
      payload: {
        typeMap: newTypeMap,
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
                categories={categories}
                onCategorySelect={onCategorySelect}
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
