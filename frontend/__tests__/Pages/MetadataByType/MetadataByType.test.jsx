import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import { MetadataByTypeBody } from '../../../src/pages/MetadataByType/MetadataByTypeBody';

global.fetch = fetch;

const carHistoryResponse = `{
  "name":"Car history",
  "tags":[{
    "tagName":"Public activity",
    "metadataTypeName":"Car history"
  },
  {
    "tagName":"Traffic",
    "metadataTypeName":"Car history"
  }],
  "description":"Wroom wroom",
  "metadataList":[{
    "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "url":"https://trondheim.kommune.no",
    "description":"",
    "formatName":"JSON",
    "releaseState":1,
    "metadataTypeName":"Car history",
    "municipalityName":"Trondheim"
  },
  {
    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afb7",
    "url":"https://bergen.kommune.no",
    "description":"",
    "formatName":"JSON",
    "releaseState":2,
    "metadataTypeName":"Car history",
    "municipalityName":"Bergen"
  }]
}`;

describe('Displays all bottom-level datasets with a given name', () => {
  // redux store
  let store;

  beforeEach(() => {
    fetch.resetMocks();
    const mockStore = configureStore();
    store = mockStore({});
  });


  it('Shows the title and description of datasets', async () => {
    fetch.mockResponseOnce(carHistoryResponse);
    const {
      findByText, getByText, queryByText, queryAllByText,
    } = render(
      <Provider store={store}>
        <MetadataByTypeBody name="Car history" />
      </Provider>,
    );

    // wait for the data to load
    await findByText('Trondheim');

    // once Trondheim is there, Bergen should be too
    getByText('Bergen');

    // Trondheim is labeled released, Bergen as ready, and none others are there
    expect(queryByText('Bodø')).toBeNull();
    expect(queryAllByText('Released').length).toBe(1);
    expect(queryAllByText('Ready to release').length).toBe(1);
    expect(queryAllByText('Needs work').length).toBe(0);
    expect(queryAllByText('Not releasable').length).toBe(0);

    // should have fetched exactly once
    expect(fetch.mock.calls.length).toEqual(1);
  });
});
