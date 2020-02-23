import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { MetadataByMunicipality } from '../../../src/pages/MetadataByMunicipality';

global.fetch = fetch;

const municipalitiesResponse = `
[
  {
    "name": "Asker",
    "mailDomain": "asker.kommune.no"
  },
  {
    "name": "Bodø",
    "mailDomain": "bodo.kommune.no"
  },
  {
    "name": "Bærum",
    "mailDomain": "baerum.kommune.no"
  },
  {
    "name": "Oslo",
    "mailDomain": "oslo.kommune.no"
  },
  {
    "name": "Test",
    "mailDomain": "test.kommune.no"
  },
  {
    "name": "Trondheim",
    "mailDomain": "trondheim.kommune.no"
  }
]`;

describe('Displays all bottom-level datasets with a given name', () => {
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


  it('Shows the list of all municipalities to select from', async () => {
    fetch.mockResponseOnce(municipalitiesResponse);
    const {
      findByText, getByText, queryByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <MetadataByMunicipality />
        </Router>
      </Provider>,
    );

    // wait for the data to load
    await findByText('Trondheim');

    // once Trondheim is there, Oslo, Bergen and Test should be too
    getByText('Oslo');
    getByText('Bærum');
    getByText('Test');

    // User is prompted to select a municipality from the result list
    getByText('Select a municipality to examine.');

    // Page has stopped displaying the loading label
    expect(queryByText('Loading')).toBeNull();

    // should have fetched exactly once
    expect(fetch.mock.calls.length).toEqual(1);
  });
});
