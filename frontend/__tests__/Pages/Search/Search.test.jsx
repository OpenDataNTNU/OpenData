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
    "formatName": "JSON",
    "releaseState": 4,
    "metadataTypeName": "Populasjon",
    "municipalityName": "Bodø",
    "experiencePostGuid": null
  },
  {
    "uuid": "0aa3ced1-7995-4daf-9820-d59322c8807f",
    "url": "https://google.com",
    "description": "Birds aren't real",
    "formatName": "JSON",
    "releaseState": 1,
    "metadataTypeName": "Populasjon",
    "municipalityName": "Test",
    "experiencePostGuid": null
  },
  {
    "uuid": "1c79d439-fa70-4168-8b70-1e3b7a250708",
    "url": "https://google.com",
    "description": "Cycle theft for Trondheim. Contains city bike theft",
    "formatName": "JSON",
    "releaseState": 2,
    "metadataTypeName": "Cycle theft",
    "municipalityName": "Trondheim",
    "experiencePostGuid": null
  },
  {
    "uuid": "93130354-334d-43f1-8f38-c499509d1589",
    "url": "https://google.co.uk",
    "description": "We have a lot of bikes",
    "formatName": "JSON",
    "releaseState": 3,
    "metadataTypeName": "Cycle history",
    "municipalityName": "Oslo",
    "experiencePostGuid": null
  }
]`;

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
    fetch.mockResponse(async ({ url }) => {
      if (url === '/api/Metadata') {
        return metadataResult;
      }
      if (url === '/api/Municipality') {
        return municipalityResult;
      }
      if (/\/api\/Metadata\/[0-9a-e]{32, 32}\/like/.test(url)) {
        return likeResultNone;
      }
      return '';
    });

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
    fetch.mockResponse(async ({ url }) => {
      if (url === '/api/Metadata') {
        return metadataResult;
      }
      if (url === '/api/Municipality') {
        return municipalityResult;
      }
      if (/\/api\/Metadata\/[0-9a-e]{32, 32}\/like/.test(url)) {
        return likeResultNone;
      }
      return '';
    });
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
    await findByText('https://google.co.uk');
    getByText('We have a lot of bikes');
    expect(queryAllByText('Cycle theft for Trondheim. Contains city bike theft').length).toBe(0);
  });
});
