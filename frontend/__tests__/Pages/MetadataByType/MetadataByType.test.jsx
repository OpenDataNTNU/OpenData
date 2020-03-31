import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { MetadataByTypeResults } from '../../../src/pages/MetadataByType/MetadataByTypeResults';

global.fetch = fetch;

const cycleHistoryResponse = `{
  "uuid": "cda9f285-52f0-4793-9cea-d389e6dca6a7",
  "name": "Cycle history",
  "tags": [
    {
      "tagName": "Public activity",
      "metadataTypeUuid": "cda9f285-52f0-4793-9cea-d389e6dca6a7"
    }
  ],
  "description": {
    "uuid": "08d7d4a9-bb48-4c82-8591-7d8f26cf91ae",
    "content": "Sykkelhistorikk i byen",
    "published": "2020-03-30T12:56:15.290819",
    "edited": "2020-03-30T12:56:15.290819",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": null
  },
  "metadataList": [
    {
      "uuid": "0b065f1e-7761-48ca-ae0a-c995f4290785",
      "url": "https://google.com",
      "description": "Pling Plong",
      "formatName": "JSON",
      "releaseState": 1,
      "metadataTypeUuid": "cda9f285-52f0-4793-9cea-d389e6dca6a7",
      "municipalityName": "Trondheim",
      "experiencePosts": []
    },
    {
      "uuid": "49a5be72-0be7-4905-8558-3b91f8b1831b",
      "url": "https://google.com",
      "description": "We have a lot of bikes",
      "formatName": "JSON",
      "releaseState": 3,
      "metadataTypeUuid": "cda9f285-52f0-4793-9cea-d389e6dca6a7",
      "municipalityName": "Oslo",
      "experiencePosts": []
    }
  ],
  "categoryUuid": "4ecd4217-2cac-4647-ba26-ded8599fd414"
}`;

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


  it('Shows the title and description of datasets', async () => {
    fetch.mockResponseOnce(cycleHistoryResponse);
    const {
      findByText, getByText, queryByText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <MetadataByTypeResults uuid="cda9f285-52f0-4793-9cea-d389e6dca6a7" />
        </Router>
      </Provider>,
    );

    // wait for the data to load
    await findByText('Trondheim');

    // once Trondheim is there, Bergen should be too
    getByText('Oslo');

    // Trondheim is labeled released, Oslo as needs work
    expect(queryByText('Bodø')).toBeNull();
    expect(queryAllByText('Released').length).toBe(1);
    expect(queryAllByText('Ready to release').length).toBe(0);
    expect(queryAllByText('Needs work').length).toBe(1);
    expect(queryAllByText('Not releasable').length).toBe(0);

    // should have fetched exactly thrice (1 + 2)
    expect(fetch.mock.calls.length).toEqual(3);
  });
});
