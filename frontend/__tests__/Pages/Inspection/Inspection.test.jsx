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
    "description":"This is a decRIPtrion",
    "releaseState":1,
    "metadataTypeName":"Car history",
    "municipalityName":"Trondheim",
    "dataSource": [
      {
        "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa1",
        "url": "https://trondheim.kommune.no",
        "description": "string",
        "dataFormat": {
          "name": "JSON",
          "description": "recent info on trondheims stuff",
          "documentationUrl": "https://google.com"
        },
        "startDate": "2019-03-16T10:07:38.067Z",
        "endDate": "2021-03-16T10:07:38.067Z"
      }
    ]
  },
  {
    "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afb7",
    "description":"",
    "releaseState":1,
    "metadataTypeName":"Car history",
    "municipalityName":"Bergen",
    "dataSource": [
      {
        "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa2",
        "url": "https://bergen.kommune.no",
        "description": "string",
        "dataFormat": {
          "name": "JSON",
          "description": "recent info on bergensk stuff",
          "documentationUrl": "https://google.com"
        },
        "startDate": "2019-03-16T10:07:38.067Z",
        "endDate": "2021-03-16T10:07:38.067Z"
      }
    ]
  }]
}`;

const carHistoryTrondheimResponse = `{
  "uuid":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "description":"This is a decRIPtrion",
  "releaseState":2,
  "metadataTypeName":"Car history",
  "municipalityName":"Trondheim",
  "dataSource": [
    {
      "uuid": "3fa85f64-5717-4562-b3fc-2c963f66afa1",
      "url": "https://trondheim.kommune.no",
      "description": "string",
      "dataFormat": {
        "name": "JSON",
        "description": "recent info on stuff",
        "documentationUrl": "https://google.com"
      },
      "startDate": "2019-03-16T10:07:38.067Z",
      "endDate": "2021-03-16T10:07:38.067Z"
    }
  ]
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

describe('Page displays bottom-level datasets from municipalities', () => {
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
        case '/api/MetadataType/Car%20history':
          return carHistoryResponse;
        case '/api/metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return carHistoryTrondheimResponse;
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

    await findByText(new RegExp('Trondheim'));
    getByText('This is a decRIPtrion');
    expect(queryByText(new RegExp('Bergen'))).toBeNull();

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
        case '/api/MetadataType/Car%20history':
          return carHistoryResponse;
        case '/api/metadata/3fa85f64-5717-4562-b3fc-2c963f66afa6':
          return carHistoryTrondheimResponse;
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
