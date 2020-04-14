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

const likeResponse = `{
  "likeCount": 12,
  "liked": false
}`;

const commentsResponse = `
  []
`;

const metadata = {
  uuid: '1443b7e7-4438-4b01-85f7-b9cf19c72e4e',
  url: 'https://google.com',
  description: 'Noe morsom data fra trondheim her ja',
  formatName: 'JSON',
  releaseState: 1,
  metadataTypeName: 'Populasjon',
  municipalityName: 'Trondheim',
  experiencePostGuid: null,
};

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


  it('Shows the comment threads counter and likes for a single dataset', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/Metadata/1443b7e7-4438-4b01-85f7-b9cf19c72e4e/like':
          return likeResponse;
        case '/api/Comment/metadata/1443b7e7-4438-4b01-85f7-b9cf19c72e4e':
          return commentsResponse;
        default:
          return '';
      }
    });
    const {
      findByText, queryByText, getByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <SingleMetaDataResult metadata={metadata} showCategory showMunicipality expanded />
        </Router>
      </Provider>,
    );
    // Wait for fetches to complete
    await findByText(new RegExp('12'));
    await findByText(new RegExp('0 threads'));

    getByText('Noe morsom data fra trondheim her ja');
    expect(queryByText(new RegExp('Bergen'))).toBeNull();

    getByText('See full entry');

    // Should have fetched exactly twice
    // - once for likes
    // - once for comments
    // - once for metadata type name
    expect(fetch.mock.calls.length).toEqual(3);
  });
});
