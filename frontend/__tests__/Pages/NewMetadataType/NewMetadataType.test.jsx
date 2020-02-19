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

const inputValue = (targetNode, newValue) => {
  fireEvent.change(
    targetNode,
    { target: { value: newValue } },
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

  it('Can be used to post a new metadata type', async () => {
    fetch.mockResponse(async ({ url }) => {
      switch (url) {
        case '/api/Tag':
          return tagsResponse;
        default:
          return '';
      }
    });
    history.push('/newMetadataType');
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
    expect(queryAllByText(new RegExp('Public activity')).length).toEqual(0);
    expect(queryAllByText(new RegExp('Public property')).length).toEqual(0);
    expect(queryAllByText(new RegExp('Public activity')).length).toEqual(0);
    // should be there after the click
    await wait(() => click(tagSelector));
    await findByText(new RegExp('Public activity'));
    const property = getByText(new RegExp('Public property'));
    getByText(new RegExp('Traffic'));
    await wait(() => click(property));
    const nameInput = getByPlaceholderText(new RegExp('Name'));
    const descriptionInput = getByPlaceholderText(new RegExp('Description'));
    await wait(() => inputValue(nameInput, 'This is a test name'));
    await wait(() => inputValue(descriptionInput, 'This is a TeSt desCRIPTION. L0rem ipsum.'));
    // before submission, only the tags should be fetched
    expect(fetch.mock.calls.length).toEqual(1);
    const submitButton = getByText(new RegExp('Submit'));
    await wait(() => click(submitButton));
    // should put once for the metadatatype and once for the tag
    expect(fetch.mock.calls.length).toEqual(3);
    const metadataBody = fetch.mock.calls[1][1].body;
    expect(metadataBody).toEqual(JSON.stringify({
      name: 'This is a test name',
      description: 'This is a TeSt desCRIPTION. L0rem ipsum.',
    }));
    expect(history.location.pathname).toEqual('/sendData');
  });
});
