import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { MunicipalityMetadataResults } from '../../../src/pages/MetadataByMunicipality/MunicipalityMetadataResults';

global.fetch = fetch;

const trondheimResponse = `[
  {
    "uuid": "08d7b3a8-383c-4f97-84d3-e2bc1eeed15b",
    "url": "minecraft.net",
    "description": "En released greie for biler eller noe idk",
    "formatName": "JSON",
    "releaseState": 1,
    "metadataTypeName": "Car history",
    "municipalityName": "Trondheim"
  },{
    "uuid": "08d7b3a1-8f69-4a39-8e3b-fd606db36b32",
    "url": "netflix.com",
    "description": "Something something",
    "formatName": "JSON",
    "releaseState": 12,
    "metadataTypeName": "Car history",
    "municipalityName": "Trondheim"
  }
  {
    "uuid": "08d7b3a1-8c41-49e8-80e0-882d6d44b16f",
    "url": "opendata.com",
    "description": "Something something",
    "formatName": "JSON",
    "releaseState": 3,
    "metadataTypeName": "Car history",
    "municipalityName": "Trondheim"
  },
  {
    "uuid": "08d7b3a1-8d9a-4f26-80a1-8c7d750f0156",
    "url": "something.no",
    "description": "Something something",
    "formatName": "JSON",
    "releaseState": 4,
    "metadataTypeName": "Car history",
    "municipalityName": "Trondheim"
  },
  {
    "uuid": "08d7b390-f56b-4be3-892e-abbd882d5fb9",
    "url": "eliasv.com",
    "description": "En nettside for bra folk",
    "formatName": "JSON",
    "releaseState": 1,
    "metadataTypeName": "Car history",
    "municipalityName": "Trondheim"
  },
  {
    "uuid": "08d7b3a1-83b4-43bd-8d19-9cb010cec108",
    "url": "something.org",
    "description": "Something something",
    "formatName": "JSON",
    "releaseState": 2,
    "metadataTypeName": "Car history",
    "municipalityName": "Trondheim"
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


  it('Shows the data sets with entries from Trondheim', async () => {
    fetch.mockResponseOnce(trondheimResponse);
    const {
      findByText, getByText, queryByText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <MunicipalityMetadataResults municipalityName="Trondheim" />
        </Router>
      </Provider>,
    );

    // wait for the data to load
    await findByText('En nettside for bra folk');

    // once loaded, eliasv.com should be there too
    getByText('eliasv.com');

    // Not loading anymore.
    expect(queryByText('Loading')).toBeNull();

    // Two results are released, one is ready, one needs work, one is not releasable
    // one is unknown
    expect(queryAllByText('Released').length).toBe(2);
    expect(queryAllByText('Ready to release').length).toBe(1);
    expect(queryAllByText('Needs work').length).toBe(1);
    expect(queryAllByText('Not releasable').length).toBe(1);
    expect(queryAllByText('Unknown release state!').length).toBe(1);

    // should have fetched exactly once
    expect(fetch.mock.calls.length).toEqual(1);
  });
});
