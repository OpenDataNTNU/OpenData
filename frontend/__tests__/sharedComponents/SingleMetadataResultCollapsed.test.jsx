import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { createMemoryHistory } from 'history';

import { SingleMetaDataResult } from '../../src/sharedComponents/Metadata/SingleMetaDataResult';

global.fetch = fetch;

describe('Rendering a single collapsed metadata result', () => {
  // redux store
  let store;
  let history;

  beforeEach(() => {
    // reset mock-fetch data and set up fetch to mock API calls
    fetch.resetMocks();
    // reset and set up redux store
    const mockStore = configureStore();
    store = mockStore({
      user: {
        loggedIn: false,
        user: {
          token: 'abcdef',
          municipalityName: 'Trondheim',
        },
      },
    });
    history = createMemoryHistory();
  });

  const metadata = {
    uuid: '0b065f1e-7761-48ca-ae0a-c995f4290785',
    url: 'https://google.com',
    description: 'Pling Plong',
    formatName: 'JSON',
    releaseState: 1,
    metadataTypeUuid: 'cda9f285-52f0-4793-9cea-d389e6dca6a7',
    municipalityName: 'Trondheim',
    experiencePosts: [],
  };
  const metadataTypeResponse = `{
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


  it('Shows the description of a single dataset', async () => {
    fetch.mockResponseOnce(metadataTypeResponse);
    const {
      findByText, queryByText, getByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <SingleMetaDataResult metadata={metadata} showCategory showMunicipality />
        </Router>
      </Provider>,
    );
    await findByText(new RegExp('Trondheim'));
    getByText('Pling Plong');
    expect(queryByText(new RegExp('Bergen'))).toBeNull();

    // Displays municipality of a dataset correctly
    getByText('Trondheim');
    // Displays category of a dataset correctly
    getByText('Cycle history');
  });

  it('Does not display prompt to see full entry, and has no fetches', async () => {
    const {
      findByText, queryByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <SingleMetaDataResult metadata={metadata} showCategory showMunicipality collapsed />
        </Router>
      </Provider>,
    );
    await findByText(new RegExp('Trondheim'));
    expect(queryByText(new RegExp('See full entry'))).toBeNull();

    // Fetches the metadata type name once
    expect(fetch.mock.calls.length).toEqual(1);
  });
});
