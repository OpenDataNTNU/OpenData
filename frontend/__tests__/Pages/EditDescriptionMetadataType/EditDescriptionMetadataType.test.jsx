import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { DescriptionEditBody } from '../../../src/pages/EditDescriptionMetadataType/DescriptionEditBody';

global.fetch = fetch;

const descriptionsResponse = `[
  {
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
    "hasVoted": true
  },
  {
    "uuid": "08d7d4cd-1dc9-43f6-823c-087b837f9c11",
    "content": "Something really cool",
    "published": "2020-03-30T17:09:32.934624",
    "edited": "2020-03-30T17:09:32.934624",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": true
  },
  {
    "uuid": "08d7d4cd-31cf-4f5d-8649-a120c884bf0c",
    "content": "A bicycle, also called a bike or cycle, is a human-powered or motor-powered, pedal-driven, single-track vehicle, having two wheels attached to a frame, one behind the other. A bicycle rider is called a cyclist, or bicyclist. ",
    "published": "2020-03-30T17:10:06.532288",
    "edited": "2020-03-30T17:10:06.532288",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": true
  },
  {
    "uuid": "08d7d4cd-d307-48e2-8535-1e5a01aecacf",
    "content": "Something awersome",
    "published": "2020-03-30T17:14:37.010308",
    "edited": "2020-03-30T17:14:37.010308",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": true
  },
  {
    "uuid": "08d7d4cd-d71c-482a-8001-db48e23cdc6c",
    "content": "Something awersome",
    "published": "2020-03-30T17:14:43.858212",
    "edited": "2020-03-30T17:14:43.858212",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": true
  },
  {
    "uuid": "08d7d4e0-1c98-4cb3-8284-2442bd4aa92a",
    "content": "A new description.",
    "published": "2020-03-30T19:25:31.387716",
    "edited": "2020-03-30T19:25:31.387716",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": true
  },
  {
    "uuid": "08d7d564-8cba-498f-82db-edf3b3d42160",
    "content": "Anotha one\\n",
    "published": "2020-03-31T11:13:33.081384",
    "edited": "2020-03-31T11:13:33.081384",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 1,
    "hasVoted": true
  },
  {
    "uuid": "08d7d4ca-c4ff-49fe-820b-3e00be564576",
    "content": "asdasd",
    "published": "2020-03-30T16:52:44.980355",
    "edited": "2020-03-30T16:52:44.980355",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 0,
    "hasVoted": false
  },
  {
    "uuid": "08d7d4cd-1a55-4e7a-8b46-b283930c4d76",
    "content": "asd",
    "published": "2020-03-30T17:09:27.14612",
    "edited": "2020-03-30T17:09:27.14612",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 0,
    "hasVoted": false
  },
  {
    "uuid": "08d7d4cd-2679-4902-8264-0754067f44fa",
    "content": "asd",
    "published": "2020-03-30T17:09:47.511612",
    "edited": "2020-03-30T17:09:47.511612",
    "metadataType": null,
    "author": {
      "mail": "elias@asker.kommune.no",
      "userType": 1,
      "municipalityName": "Asker"
    },
    "voteCount": 0,
    "hasVoted": false
  }
]`;

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

describe('Displays all bottom-level datasets with a given name', () => {
  // redux store
  let store;

  // router history
  let history;

  beforeEach(() => {
    // reset mock-fetch data and set up fetch to mock API calls
    fetch.resetMocks();
    // reset and set up redux store
    const mockStore = configureStore();
    store = mockStore({
      user: {
        loggedIn: true,
        user: {
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImVsaWFzQGFza2VyLmtvbW11bmUubm8iLCJ1bmlxdWVfbmFtZSI6ImVsaWFzQGFza2VyLmtvbW11bmUubm8iLCJuYmYiOjE1ODU1NzI5MTcsImV4cCI6MTU4NTgzMjExNywiaWF0IjoxNTg1NTcyOTE3fQ.hG9LxD1ROpR2yGoQ6mAzHbSTK4QQMACVKX5kx-adOho',
          municipalityName: 'Asker',
        },
      },
    });
    history = createMemoryHistory();
  });

  it('Shows the suggested descriptions of data types', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/MetadataType/cda9f285-52f0-4793-9cea-d389e6dca6a7/description':
          return descriptionsResponse;
        case '/api/MetadataType/cda9f285-52f0-4793-9cea-d389e6dca6a7':
          return metadataTypeResponse;
        default:
          return '';
      }
    });
    const {
      findByText, getByText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <DescriptionEditBody uuid="cda9f285-52f0-4793-9cea-d389e6dca6a7" />
        </Router>
      </Provider>,
    );

    // wait for the data to load
    await findByText('Something really cool');

    // once "Something really cool" is there, "asdasd" should be too
    getByText('asdasd');

    // Multiple responses from Asker
    expect(queryAllByText('elias@asker.kommune.no from Asker').length).toBe(10);

    /* should have fetched exactly twice.
      - Once for metadatatype
      - Once for descriptions
    */

    expect(fetch.mock.calls.length).toEqual(2);
  });
});
