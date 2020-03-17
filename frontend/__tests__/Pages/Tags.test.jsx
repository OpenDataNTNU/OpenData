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

import { NewTag } from '../../src/pages/NewTag';
import { Tags } from '../../src/pages/Tags';

global.fetch = fetch;

describe('Tags', () => {
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
          userType: 0,
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFuZHJlYXNqakBnbWFpbC5jb20iLCJuYmYiOjE1ODE5MzUwMTcsImV4cCI6MTU4MjE5NDIxNywiaWF0IjoxNTgxOTM1MDE3fQ.I4UhSMCFprnwQuwRQ_QZRRePcfoXva--viYto8_uH9U',
        },
      },
    };
    store = mockStore(initialEmptyState);
    history = createMemoryHistory();
  });

  it('should allow us to able to load all tags and display them in a list', async () => {
    fetch.mockResponse(JSON.stringify([
      {
        name: 'Tag 1',
      },
      {
        name: 'Tag 2',
      },
      {
        name: 'Tag 3',
      },
      {
        name: 'Tag 4',
      },
    ]));

    let GetByText;
    await wait(() => {
      const { getByText } = render(
        <Provider store={store}>
          <Router history={history}>
            <Tags />
          </Router>
        </Provider>,
      );
      GetByText = getByText;
    });


    const tag1 = GetByText('Tag 1');
    const tag2 = GetByText('Tag 2');
    const tag3 = GetByText('Tag 3');
    const tag4 = GetByText('Tag 4');

    // Check that button exists
    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();
    expect(tag3).toBeInTheDocument();
    expect(tag4).toBeInTheDocument();
  });

  it('should let us submit a new tag', async () => {
    fetch.mockResponse(JSON.stringify([
      {
        name: 'Tag 1',
      },
      {
        name: 'Tag 2',
      },
      {
        name: 'Tag 3',
      },
      {
        name: 'Tag 4',
      },
    ]));

    let GetByText;
    let GetByPlaceholderText;
    await wait(() => {
      const { getByText, getByPlaceholderText } = render(
        <Provider store={store}>
          <Router history={history}>
            <NewTag />
          </Router>
        </Provider>,
      );
      GetByText = getByText;
      GetByPlaceholderText = getByPlaceholderText;
    });

    await wait(() => {
      fireEvent.change(
        GetByPlaceholderText('New Tag'),
        { target: { value: 'A New Tag' } },
      );
    });

    await wait(() => {
      fireEvent(
        GetByText('submit', { selector: 'button' }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions[0]).toEqual({
      type: 'ALERT_SUCCESS',
      message: 'Successfully submitted tag. Redirecting in 5 seconds.',
    });
  });

  it('should not let us submit an existing tag or a tag with non-alphabetical letters in it', async () => {
    fetch.mockResponse(JSON.stringify([
      {
        name: 'Tag',
      },
      {
        name: 'Tag 2',
      },
      {
        name: 'Tag 3',
      },
      {
        name: 'Tag 4',
      },
    ]));

    let GetByText;
    let GetByPlaceholderText;
    await wait(() => {
      const { getByText, getByPlaceholderText } = render(
        <Provider store={store}>
          <Router history={history}>
            <NewTag />
          </Router>
        </Provider>,
      );
      GetByText = getByText;
      GetByPlaceholderText = getByPlaceholderText;
    });

    await wait(() => {
      fireEvent.change(
        GetByPlaceholderText('New Tag'),
        { target: { value: 'Tag' } },
      );
    });

    await wait(() => {
      fireEvent(
        GetByText('submit', { selector: 'button' }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    await wait(() => {
      fireEvent.change(
        GetByPlaceholderText('New Tag'),
        { target: { value: 'Tag 1' } },
      );
    });

    await wait(() => {
      fireEvent(
        GetByText('submit', { selector: 'button' }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(2);
    expect(expectedActions[0]).toEqual({
      type: 'ALERT_ERROR',
      message: 'The tag already exists.',
    });
    expect(expectedActions[1]).toEqual({
      type: 'ALERT_ERROR',
      message: 'Tags can only contain letters',
    });
  });
});
