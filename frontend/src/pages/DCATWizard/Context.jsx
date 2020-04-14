import React, { createContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const WizardContext = createContext();

const init = {
  file: null,
  fileContent: null,
  mimetypes: [],
  datasetsState: {
    datasets: [],
    selections: new Map(),
  },
  catalogsState: {
    catalogs: [],
    selections: new Map(),
    typeMap: new Map(),
  },
  datasetCatalogConnection: new Map(),
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return init;
    case 'addFile':
      return {
        ...state,
        file: action.payload,
      };
    case 'addFileContent':
      return {
        ...state,
        fileContent: action.payload,
      };
    case 'addMimetypes':
      return {
        ...state,
        mimetypes: action.payload,
      };
    case 'addDatasets':
      return {
        ...state,
        datasetsState: {
          ...state.datasetsState,
          datasets: action.payload.datasets,
          selections: action.payload.selections,
        },
      };
    case 'newSelection':
      return {
        ...state,
        datasetsState: {
          ...state.datasetsState,
          selections: action.payload.selections,
        },
      };
    case 'selectAllDatasets':
      return {
        ...state,
        datasetsState: {
          ...state.datasetsState,
          selections: action.payload.selections,
        },
      };
    case 'deselectAllDatasets':
      return {
        ...state,
        datasetsState: {
          ...state.datasetsState,
          selections: action.payload.selections,
        },
      };
    case 'addCatalogs':
      return {
        ...state,
        catalogsState: {
          ...state.catalogsState,
          catalogs: action.payload.catalogs,
          selections: action.payload.selections,
        },
      };
    case 'selectCatalog':
      return {
        ...state,
        catalogsState: {
          ...state.catalogsState,
          selections: action.payload.selections,
        },
      };
    case 'selectAllCatalogs':
      return {
        ...state,
        catalogsState: {
          ...state.catalogsState,
          selections: action.payload.selections,
        },
      };
    case 'deselectAllCatalogs':
      return {
        ...state,
        catalogsState: {
          ...state.catalogsState,
          selections: action.payload.selections,
        },
      };
    case 'selectCatalogType':
      return {
        ...state,
        catalogsState: {
          ...state.catalogsState,
          typeMap: action.payload.typeMap,
        },
      };
    case 'addDatasetCatalogConnection':
      return {
        ...state,
        datasetCatalogConnection: action.payload,
      };
    default:
      return init;
  }
};

function Provider({ children }) {
  const [state, dispatch] = useReducer(reducer, init);
  const value = { state, dispatch };

  return (
    <WizardContext.Provider value={value}>{ children }</WizardContext.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.arrayOf(PropTypes.element).isRequired,
};

const { Consumer } = WizardContext;

export {
  WizardContext,
  Provider,
  Consumer,
};
