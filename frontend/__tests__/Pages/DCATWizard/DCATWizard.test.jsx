import React from 'react';
import {
  render, wait, fireEvent,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { DCATWizard as Wizard } from '../../../src/pages/DCATWizard/index';
import parseJsonLd from '../../../src/lib/dcat-ld';
import filecontents from '../../../__mocks__/DCATWizard/file';
import result from '../../../__mocks__/DCATWizard/result';

global.fetch = fetch;

describe('DCAT NO Wizard', () => {
  // mock store and history
  let store;
  let history;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore([thunk]);
    // Initialize mockstore with empty state
    const initialEmptyState = {
      user: {
        user: {
          mail: 'andreasjj@gmail.com',
          userType: 1,
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJlYXNqakBnbWFpbC5jb20iLCJuYmYiOjE1ODE5MzUwMTcsImV4cCI6MTU4MjE5NDIxNywiaWF0IjoxNTgxOTM1MDE3fQ.I4UhSMCFprnwQuwRQ_QZRRePcfoXva--viYto8_uH9U',
        },
      },
    };
    store = mockStore(initialEmptyState);
    history = createMemoryHistory();
  });

  it('should extract data from json-ld', async () => {
    const newResult = parseJsonLd(filecontents);

    expect(newResult).toEqual(result);
  });

  it('should let us go through upload process', async () => {
    let GetByLabelText;
    let GetByText;
    await wait(() => {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <Wizard />
          </Router>
        </Provider>,
      );
      GetByLabelText = getByLabelText;
      GetByText = getByText;
    });
    // should the line above use `componentWrapper.instance()` instead?
    const file = new File([JSON.stringify(filecontents)], 'data.png', {
      type: 'application/ld+json',
    });

    const input = GetByLabelText('Add file', { selector: 'input' });

    await wait(() => {
      fireEvent.change(
        input,
        { target: { files: [file] } },
      );
    });

    const rightButton1 = await GetByText('DCAT Datasets');

    await wait(() => {
      fireEvent(
        rightButton1,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const loadMoreButton1 = GetByText(`Load more (${Object.entries(result.datasets).length - 10})`);
    expect(loadMoreButton1).toBeInTheDocument();

    const rightButton2 = await GetByText('DCAT Catalogs');

    await wait(() => {
      fireEvent(
        rightButton2,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const loadMoreButton2 = GetByText(`Load more (${Object.entries(result.catalogs).length - 10})`);
    expect(loadMoreButton2).toBeInTheDocument();

    const rightButton3 = await GetByText('Dataset-Catalog Connection');

    await wait(() => {
      fireEvent(
        rightButton3,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const loadMoreButton3 = GetByText(`Load more (${Object.entries(result.datasets).length - 10})`);
    expect(loadMoreButton3).toBeInTheDocument();

    const rightButton4 = await GetByText('Submission');

    await wait(() => {
      fireEvent(
        rightButton4,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const submitButton = GetByText('Submit Datasets and Catalogs');
    expect(submitButton).toBeInTheDocument();
  });
});
