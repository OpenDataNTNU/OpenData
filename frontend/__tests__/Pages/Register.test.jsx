import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';

import App from '../../src/App';

global.fetch = fetch;

describe('Template component', () => {
  // mock store and history
  let store;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore([thunk]);
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);
  });

  it('should give successful registration state in store', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fetch.mockResponseOnce(
      JSON.stringify({ token: 'lfkmasfDFDFSAsldf21p4jl2fsdf' }),
      { status: 201, headers: { 'content-type': 'application/json' } },
    );

    await wait(() => {
      fireEvent(
        getByText('Sign in'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    await wait(() => {
      fireEvent(
        getByText('Sign up here'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    await wait(() => {
      fireEvent.change(
        getByPlaceholderText('Email'),
        { target: { value: 'andreas@baerum.kommune.no' } },
      );
    });

    await wait(() => {
      fireEvent.change(
        getByPlaceholderText('Password'),
        { target: { value: 'Test123@' } },
      );
    });

    await wait(() => {
      fireEvent.change(
        getByPlaceholderText('Verify password'),
        { target: { value: 'Test123@' } },
      );
    });

    await wait(() => {
      fireEvent(
        getByText('Create account', { selector: 'button' }),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(4);
    expect(expectedActions[2]).toEqual({ type: 'USER_SET_USER_REGISTRATION_REQUEST' });
    expect(expectedActions[3]).toEqual({
      type: 'USER_SET_USER_REGISTRATION_SUCCESS',
    });
  });
});
