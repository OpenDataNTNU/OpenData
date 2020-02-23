import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

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

  beforeEach(() => {
    // reset mock-fetch data and set up fetch to mock API calls
    fetch.resetMocks();
    // reset and set up redux store
    const mockStore = configureStore();
    store = mockStore({});
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
        <InspectionBody id="3fa85f64-5717-4562-b3fc-2c963f66afa6" />
      </Provider>,
    );

    await findByText(new RegExp('Trondheim'));
    getByText('Wroom wroom');
    expect(queryByText(new RegExp('Bergen'))).toBeNull();

    // should have fetched exactly twice, once for fetching municipalities and once for submitting.
    expect(fetch.mock.calls.length).toEqual(2);
  });
});
