import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MutationObserver from 'mutation-observer';

import { NewMetadataTypeBody } from '../../../src/pages/NewMetadataType/NewMetadataTypeBody';

global.fetch = fetch;
global.MutationObserver = MutationObserver;

describe('Provides a form to create metadata types', () => {
  // redux store
  let store;

  // router history
  let history;

  beforeEach(() => {
    fetch.resetMocks();
    const mockStore = configureStore();
    store = mockStore({});
    history = createMemoryHistory();
  });


  it('Renders correctly', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <NewMetadataTypeBody />
        </Router>
      </Provider>,
    );
  });
});
