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
import MutationObserver from 'mutation-observer';

import { NewExperienceArticle } from '../../../src/pages/NewExperienceArticle/index';

global.fetch = fetch;
global.MutationObserver = MutationObserver;
global.document.getSelection = () => ({
  removeAllRanges: jest.fn().mockImplementation(() => true),
  getRangeAt: jest.fn().mockImplementation(() => true),
});

describe('New Experience Article component', () => {
  // mock store and history
  let store;
  let history;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore([thunk]);
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);
    history = createMemoryHistory();
  });

  it('should not let us submit without a title', async () => {
    fetch.mockResponse(JSON.stringify([
      {
        name: 'Public activity',
      },
      {
        name: 'Public property',
      },
      {
        name: 'Traffic',
      },
    ]));

    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <NewExperienceArticle />
        </Router>
      </Provider>,
    );

    const submitButton = getByText('Submit Article');

    // Check that button exists
    expect(submitButton).toBeInTheDocument();

    // Check that the button is disabled
    expect(submitButton.disabled).toBe(true);
  });

  it('should dispatch an error if we fail to fetch tags or datasets from the backend', async () => {
    fetch.mockReject(JSON.stringify({
      error: 'Error',
      status: 500,
    }));

    await wait(() => {
      render(
        <Provider store={store}>
          <Router history={history}>
            <NewExperienceArticle />
          </Router>
        </Provider>,
      );
    });

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(2);
    expect(expectedActions[0]).toEqual({
      message: 'Failed to retrieve tags. Please try again later.',
      type: 'ALERT_ERROR',
    });
    expect(expectedActions[1]).toEqual({
      message: 'Failed to retrieve datasets. Please try again later.',
      type: 'ALERT_ERROR',
    });
  });

  it('should let us write an experience article (with id = undefined) and submit it to the backend', async () => {
    // Set the url for id = undefined
    history.push('/articles/new/');

    fetch.mockResponses([
      JSON.stringify([
        {
          name: 'Public activity',
        },
        {
          name: 'Public property',
        },
        {
          name: 'Traffic',
        },
      ]),
      {
        status: 200,
      },
    ],
    [
      JSON.stringify([
        {
          uuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          url: 'http://google.com',
          description: 'Very nice example',
          formatName: 'Json',
          releaseState: 1,
          metadataTypeName: 'Car history',
          municipalityName: 'Asker',
          experiencePostGuid: null,
        },
        {
          uuid: '08d7b205-43f8-4daf-8f66-5d5c930809e4',
          url: 'http://google.com',
          description: 'Very nice example',
          formatName: 'Json',
          releaseState: 1,
          metadataTypeName: 'Car history',
          municipalityName: 'Asker',
          experiencePostGuid: null,
        },
      ]),
      {
        status: 200,
      },
    ],
    [
      JSON.stringify({
        experiencePost: {
          uuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          title: 'Test title',
          contents: 'TEst',
          lastEditedBy: null,
          tags: null,
          created: '2020-02-15T14:21:09.363461',
          modified: '2020-02-15T14:21:09.363461',
        },
        success: true,
        message: '',
      }),
      {
        status: 200,
      },
    ]);

    let GetByLabelText;
    let GetByText;
    await wait(() => {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <NewExperienceArticle />
          </Router>
        </Provider>,
      );
      GetByLabelText = getByLabelText;
      GetByText = getByText;
    });

    await wait(() => {
      fireEvent.change(
        GetByLabelText('Title:'),
        { target: { value: 'Test' } },
      );
    });

    await wait(() => {
      fireEvent(
        GetByText('Submit Article', { selector: 'button' }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions[0]).toEqual({
      message: 'Article successfully submitted. Redirecting in 3 seconds.',
      type: 'ALERT_SUCCESS',
    });
  });

  it('should let us write an experience article (with id != undefined) and submit it to the backend', async () => {
    // Set the url for id != undefined
    await wait(() => {
      history.push('/articles/new/08d7b222-4d55-49ff-816e-26e15f67a60d');
    });

    fetch.mockResponses(
      [
        JSON.stringify([
          {
            name: 'Public activity',
          },
          {
            name: 'Public property',
          },
          {
            name: 'Traffic',
          },
        ]),
        {
          status: 200,
        },
      ],
      [
        JSON.stringify({
          uuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
          url: 'http://google.com',
          description: 'Very nice example',
          formatName: 'Json',
          releaseState: 1,
          metadataTypeName: 'Car history',
          municipalityName: 'Asker',
          experiencePostGuid: null,
        }),
        {
          status: 200,
        },
      ],
      [
        JSON.stringify({
          experiencePost: {
            uuid: '08d7b222-4d55-49ff-816e-26e15f67a60d',
            title: 'Test title',
            contents: 'TEst',
            lastEditedBy: null,
            tags: null,
            created: '2020-02-15T14:21:09.363461',
            modified: '2020-02-15T14:21:09.363461',
          },
          success: true,
          message: '',
        }),
        {
          status: 200,
        },
      ],
    );

    let GetByLabelText;
    let GetByText;
    await wait(() => {
      const { getByLabelText, getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <NewExperienceArticle />
          </Router>
        </Provider>,
      );
      GetByLabelText = getByLabelText;
      GetByText = getByText;
    });

    await wait(() => {
      fireEvent.change(
        GetByLabelText('Title:'),
        { target: { value: 'Test' } },
      );
    });

    await wait(() => {
      fireEvent(
        GetByText('Submit Article', { selector: 'button' }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions[0]).toEqual({
      message: 'Article successfully submitted. Redirecting in 3 seconds.',
      type: 'ALERT_SUCCESS',
    });
  });
});
