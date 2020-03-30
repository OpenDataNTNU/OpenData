import React, { createContext, useReducer } from 'react';

const WizardContext = createContext();

const init = {
  file: null,
  fileContent: null,
  datasetsState: {
    datasets: [],
    selections: new Map(),
  },
  catalogsState: {

  },
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

const { Consumer } = WizardContext;

export {
  WizardContext,
  Provider,
  Consumer,
};
