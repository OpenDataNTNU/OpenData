import React from 'react';
import {
  render, wait, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MutationObserver from 'mutation-observer';

import { NewMetadataTypeBody } from '../../../src/pages/NewMetadataType/NewMetadataTypeBody';

global.fetch = fetch;
global.MutationObserver = MutationObserver;


const click = (x) => {
  fireEvent(
    x,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

const tagsResponse = `
  [
    {
      "name": "Public activity"
    },
    {
      "name": "Public property"
    },
    {
      "name": "Traffic"
    }
  ]
`;

describe('Provides a form to create metadata types', () => {
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


  it('Renders correctly', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <NewMetadataTypeBody />
        </Router>
      </Provider>,
    );
  });

  it('Shows the correct options for tags', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/Tag':
          return tagsResponse;
        default:
          return '';
      }
    });
    const {
      getByPlaceholderText, findByText, getByText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <NewMetadataTypeBody />
        </Router>
      </Provider>,
    );
    const tagSelector = getByPlaceholderText(new RegExp('Tags'));
    // options should not be there before the multiselector is clicked
    expect(queryAllByText(new RegExp('Public activity')).length).toBe(0);
    expect(queryAllByText(new RegExp('Public property')).length).toBe(0);
    expect(queryAllByText(new RegExp('Public activity')).length).toBe(0);
    // should be there after the click
    await wait(() => click(tagSelector));
    await findByText(new RegExp('Public activity'));
    getByText(new RegExp('Public property'));
    getByText(new RegExp('Traffic'));
  });
});
