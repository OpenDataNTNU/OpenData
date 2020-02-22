import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { MetadataForm } from '../../../src/pages/SendMetadata/MetadataForm';

global.fetch = fetch;

const click = (x) => {
  fireEvent(
    x,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

describe('Metadata form component works as expected', () => {
  let store;
  let history;

  beforeEach(() => {
    fetch.resetMocks();
    const mockStore = configureStore();
    // user should be logged in when seeing this page
    store = mockStore({
      user: {
        user: {
          token: 'abcdef',
        },
      },
    });
    history = createMemoryHistory();
  });


  it('displays an error message when fetch request is rejected', async () => {
    // let the first two fetches go to get municipalities and to get metadata types
    fetch.mockResponseOnce(JSON.stringify([{ name: 'Trondheim' }, { name: 'Oslo' }]));
    fetch.mockResponseOnce(JSON.stringify([]));
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <MetadataForm />
        </Router>
      </Provider>,
    );
    // initially should have no error message
    fetch.mockAbort();
    await wait(() => click(getByText('Submit')));
    // should give you an error - check this from redux store
    // should have fetched exactly three times
    // twice for fetching on load and once for submitting.
    expect(fetch.mock.calls.length).toEqual(3);
  });

  it('Succeeds when the fetch request goes well', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ name: 'Trondheim' }, { name: 'Oslo' }]));
    fetch.mockResponseOnce(JSON.stringify([]));
    // update this when API-call format is clarified
    fetch.mockResponse(JSON.stringify({ status: 'ok' }));
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <MetadataForm />
        </Router>
      </Provider>,
    );

    // click the submit button
    await wait(() => click(getByText('Submit')));
    // TODO: expect the history to change
    // also expect there to be no error
    // should have fetched exactly twice, once for fetching municipalities and once for submitting.
    expect(fetch.mock.calls.length).toEqual(3);
  });
});
