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
const cycleTheftResponse = `
  {
    "uuid": "079ba832-a53c-4e3a-9d3e-ed4667e42a95",
    "name": "Cycle theft",
  "tags":[{
      "tagName":"Public activity",
      "metadataTypeName":"Cycle Theft"
    }],
  "description": null,
  "metadataList": [
    {
      "uuid": "c9d76eaa-bd32-4ef2-89ec-dd20b5ff78d2",
      "url": "https://google.com",
      "description": "We have a lot of bikes. Some get stolen. Not the city bikes though.",
      "formatName": "JSON",
      "releaseState": 1,
      "metadataTypeUuid": "079ba832-a53c-4e3a-9d3e-ed4667e42a95",
      "municipalityName": "Trondheim",
      "experiencePosts": []
    },
  ],
  "categoryUuid": "4ecd4217-2cac-4647-ba26-ded8599fd414"
}`;

const cycleTheftTrondheimResponse = `{
  "uuid": "c9d76eaa-bd32-4ef2-89ec-dd20b5ff78d2",
  "description": "We have a lot of bikes. Some get stolen. Not the city bikes though.",
  "releaseState": 1,
  "metadataTypeUuid": "079ba832-a53c-4e3a-9d3e-ed4667e42a95",
  "municipalityName": "Trondheim",
  "dataSource": [
    {
      "uuid": "c9d76eaa-bd32-4ef2-89ec-dd20b5ff78d2",
      "url": "string",
      "description": "string",
      "dataFormat": {
        "name": "JSON",
        "description": "Something about bikes",
        "documentationUrl": "https://google.com"
      },
      "startDate": "2020-04-13T17:40:35.571Z",
      "endDate": "2020-05-13T17:40:35.571Z"
    }
  ],
  "experiencePosts": []
}`;

const commentResponse = `
  [
    {
      "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afaa",
      "content":"I quite enjoyed reading this. Lurem ipsoM.",
      "userMail":"test@test.kommune.no",
      "user":null,
      "published" :"02-02-2020",
      "edited":"02-02-2020",
      "hasChildren":false,
      "parentCommentUuid":"00000000-0000-0000-0000-000000000000",
      "childComments":[{
        "uuid":"08d7c110-2e54-437a-8c7f-b35e57fef5e0",
        "content":"Thank you for your INTEREST, kind sir!",
        "userMail":"alex@trondheim.kommune.no",
        "user":null,
        "published" :"02-02-2020",
        "edited":"02-02-2020",
        "hasChildren":false,
        "parentCommentUuid":"3fa85f64-5717-4562-b3fc-2c963f66afaa",
        "childComments":[]
      }]
    },
    {
      "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afab",
      "content":"I REALLY hated reading this. Utter garbage. Not impressed AT ALL. qwop",
      "userMail":"test@test.kommune.no",
      "user":null,
      "published" : "01-01-1970",
      "edited": "01-01-2011",
      "hasChildren":true,
      "parentCommentUuid":"00000000-0000-0000-0000-000000000000",
      "childComments": []
    }
  ]
`;

describe('Page displays a single dataset entry', () => {
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


  it('Shows the title and description of a single dataset', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/MetadataType/079ba832-a53c-4e3a-9d3e-ed4667e42a95':
          return cycleTheftResponse;
        case '/api/Metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return cycleTheftTrondheimResponse;
        case '/api/Comment/metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return commentResponse;
        default:
          return '';
      }
    });
    const {
      findByText, queryByText, getByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <InspectionBody id="3fa85f64-5717-4562-b3fc-2c963f66afa6" />
        </Router>
      </Provider>,
    );

    // Wait for metadata to load
    await findByText('Trondheim');
    getByText('We have a lot of bikes. Some get stolen. Not the city bikes though.');
    expect(queryByText(new RegExp('Unknown release state!'))).toBeNull();

    // Should have fetched exactly thrice:
    // - Once for fetching municipalities
    // - Once of like counter
    // - Once for submitting.
    // - Once for comments
    expect(fetch.mock.calls.length).toEqual(4);
  });

  it('Displays comments of a dataset correctly', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/MetadataType/079ba832-a53c-4e3a-9d3e-ed4667e42a95':
          return cycleTheftResponse;
        case '/api/Metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return cycleTheftTrondheimResponse;
        case '/api/Comment/metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return commentResponse;
        default:
          return '';
      }
    });
    const {
      getByText, findByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <InspectionBody id="3fa85f64-5717-4562-b3fc-2c963f66afa6" />
        </Router>
      </Provider>,
    );

    await findByText(new RegExp('Trondheim'));
    await findByText(new RegExp('I quite enjoyed reading this\\. Lurem ipsoM\\.'));
    getByText(new RegExp('I REALLY hated reading this\\. Utter garbage\\. Not impressed AT ALL\\. qwop'));
    getByText(new RegExp('Thank you for your INTEREST, kind sir!'));
  });
});
