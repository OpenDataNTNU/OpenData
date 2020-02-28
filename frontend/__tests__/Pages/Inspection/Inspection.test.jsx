import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';

import { InspectionBody } from '../../../src/pages/Inspection/InspectionBody';

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
    "releaseState":1,
    "metadataTypeName":"Car history",
    "municipalityName":"Bergen"
  }]
}`;

const carHistoryTrondheimResponse = `{
  "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "url":"https://trondheim.kommune.no",
  "description":"","formatName":"JSON",
  "releaseState":2,
  "metadataTypeName":"Car history",
  "municipalityName":"Trondheim"
}`;

describe('Page displays bottom-level datasets from municipalities', () => {
  // redux store
  let store;
  let history;

  beforeEach(() => {
    // reset mock-fetch data and set up fetch to mock API calls
    fetch.resetMocks();
    // reset and set up redux store
    const mockStore = configureStore();
    store = mockStore({});
    history = createMemoryHistory();
  });


  it('Shows the title and description of a single dataset', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/MetadataType/Car%20history':
          return carHistoryResponse;
        case '/api/metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return carHistoryTrondheimResponse;
        default:
          return '';
      }
    });
    const {
      getByText, findByText, queryByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <InspectionBody id="3fa85f64-5717-4562-b3fc-2c963f66afa6" />
        </Router>
      </Provider>,
    );

    await findByText(new RegExp('Trondheim'));
    getByText('Wroom wroom');
    expect(queryByText(new RegExp('Bergen'))).toBeNull();

    // Should have fetched exactly thrice:
    // - Once for fetching municipalities
    // - Once of like counter
    // - Once for submitting.
    expect(fetch.mock.calls.length).toEqual(3);
  });
});
