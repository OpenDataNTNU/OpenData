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

const api = async ({ url }) => {
  switch (url) {
    case '/api/MetadataType':
      return '[]';
    case '/api/Municipalities':
      return JSON.stringify([{ name: 'Trondheim' }, { name: 'Oslo' }]);
    default:
      return '{}';
  }
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
          municipalityName: 'Trondheim',
        },
      },
    });
    history = createMemoryHistory();
  });

  it('Succeeds when the fetch request goes well', async () => {
    fetch.mockResponse(api);
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <MetadataForm />
        </Router>
      </Provider>,
    );
    const submitButton = getByText('Submit');
    // click the submit button
    await wait(() => click(submitButton));
    // TODO: expect the history to change
    // also expect there to be no error
    // should have fetched exactly twice, once for fetching metadata types and once for submitting.
    expect(fetch.mock.calls.length).toEqual(2);
  });
});
