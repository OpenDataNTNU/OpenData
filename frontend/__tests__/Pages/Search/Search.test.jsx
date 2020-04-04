import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import fetch from 'jest-fetch-mock';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import MutationObserver from 'mutation-observer';

import { SearchBody } from '../../../src/pages/Search/SearchBody';

global.fetch = fetch;
global.MutationObserver = MutationObserver;

const metadataResult = `[
  {
    "uuid": "06418ead-7ba7-40cf-9850-24946158ead9",
    "url": "https://google.com",
    "description": "BODØ pupolation numbreros",
    "releaseState": 4,
    "metadataTypeUuid": "6a774633-bc0c-40c9-88f4-00a06bf9bf80",
    "municipalityName": "Bodø",
    "dataSource": [],
    "experiencePosts": []
  },
  {
    "uuid": "0aa3ced1-7995-4daf-9820-d59322c8807f",
    "url": "https://google.com",
    "description": "Birds aren't real",
    "releaseState": 1,
    "metadataTypeUuid": "6a774633-bc0c-40c9-88f4-00a06bf9bf80",
    "municipalityName": "Test",
    "dataSource": [],
    "experiencePosts": []
  },
  {
    "uuid": "1c79d439-fa70-4168-8b70-1e3b7a250708",
    "url": "https://google.com",
    "description": "Cycle theft for Trondheim. Contains city bike theft",
    "releaseState": 2,
    "metadataTypeUuid": "f09c3306-603a-4fc0-a8e2-5ee915a2cb3c",
    "municipalityName": "Trondheim",
    "dataSource": [],
    "experiencePosts": []
  },
  {
    "uuid": "93130354-334d-43f1-8f38-c499509d1589",
    "url": "https://google.co.uk",
    "description": "We have a lot of bikes",
    "releaseState": 3,
    "metadataTypeUuid": "42ad9aae-222c-41e7-bd8c-ebf2a4dee712",
    "municipalityName": "Oslo",
    "dataSource": [],
    "experiencePosts": []
  }
]`;

const uuidToName = {
  '6a774633-bc0c-40c9-88f4-00a06bf9bf80': 'Populasjon',
  'f09c3306-603a-4fc0-a8e2-5ee915a2cb3c': 'Cycle theft',
  '42ad9aae-222c-41e7-bd8c-ebf2a4dee712': 'Cycle history',
};

const municipalityResult = `[
  {
    "name": "Asker",
    "mailDomain": "asker.kommune.no"
  },
  {
    "name": "Bodø",
    "mailDomain": "bodo.kommune.no"
  },
  {
    "name": "Bærum",
    "mailDomain": "baerum.kommune.no"
  },
  {
    "name": "Oslo",
    "mailDomain": "oslo.kommune.no"
  },
  {
    "name": "Test",
    "mailDomain": "test.kommune.no"
  },
  {
    "name": "Trondheim",
    "mailDomain": "trondheim.kommune.no"
  }
]`;

const likeResultNone = '{"likeCount":0,"liked":false}';

const click = (x) => {
  fireEvent(
    x,
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    }),
  );
};

const input = (target, value) => {
  fireEvent.change(
    target,
    { target: { value } },
  );
};

const api = async ({ url }) => {
  if (url === '/api/Metadata') {
    return metadataResult;
  }
  if (url === '/api/Municipality') {
    return municipalityResult;
  }
  if (/\/api\/Metadata\/[0-9a-e-]{36, 36}\/like/.test(url)) {
    return likeResultNone;
  }
  if (url.startsWith('/api/MetadataType/')) {
    const uuid = url.substring(18);
    return JSON.stringify({
      name: uuidToName[uuid],
    });
  }
  return '';
};

describe('Search component works as expected', () => {
  let store;
  let history;

  beforeEach(() => {
    fetch.resetMocks();
    const mockStore = configureStore();
    // user should be logged in when seeing this page
    store = mockStore({});
    history = createMemoryHistory();
  });

  it('Renders without crashing', async () => {
    render(
      <Provider store={store}>
        <Router history={history}>
          <SearchBody />
        </Router>
      </Provider>,
    );
  });

  it('Can search by name and description', async () => {
    fetch.mockResponse(api);

    const {
      getByText, findByText, getByPlaceholderText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <SearchBody />
        </Router>
      </Provider>,
    );
    // should display all results in the beginning
    await findByText('Birds aren\'t real');
    // input some prompts into the search fields
    await wait(() => input(getByPlaceholderText('Name'), 'Cycle'));
    await wait(() => input(getByPlaceholderText('Description'), 'bikes'));
    // click the search button
    await wait(() => click(getByText('Search')));
    // after the search, a cycle history result should still be there
    await findByText('Cycle history');
    getByText('We have a lot of bikes');
    // Birds aren't real does not match bikes, and should not be included
    expect(queryAllByText('Birds aren\'t real').length).toBe(0);
  });

  it('Can search by municipality', async () => {
    fetch.mockResponse(api);
    const {
      getByText, findByText, getByPlaceholderText, queryAllByText,
    } = render(
      <Provider store={store}>
        <Router history={history}>
          <SearchBody />
        </Router>
      </Provider>,
    );
    const municipalitySelector = getByPlaceholderText('Municipalities');
    await wait(() => click(municipalitySelector));
    await wait(() => click(getByText('Asker')));
    await wait(() => click(getByText('Search')));
    // No results should be found
    await findByText('No results found for your query');
    await wait(() => click(municipalitySelector));
    await wait(() => click(getByText('Oslo')));
    await wait(() => click(getByText('Search')));
    getByText('We have a lot of bikes');
    expect(queryAllByText('Cycle theft for Trondheim. Contains city bike theft').length).toBe(0);
  });
});
