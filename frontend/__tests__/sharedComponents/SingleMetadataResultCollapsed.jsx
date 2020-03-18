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
    uuid: 'b2dc92f2-3850-4363-a66b-5e50c3465758',
    url: 'https://google.com',
    description: 'Pling Plong',
    formatName: 'JSON',
    releaseState: 1,
    metadataTypeName: 'Cycle history',
    municipalityName: 'Trondheim',
    experiencePostGuid: null,
  };


  it('Shows the description of a single dataset', async () => {
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
    expect(fetch.mock.calls.length).toEqual(0);
  });
});
