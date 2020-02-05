import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import fetch from 'jest-fetch-mock';

import App from '../../src/App';

global.fetch = fetch;

describe('Template component', () => {
  // mock store and history
  let store;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore();
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);
  });

  it('should render the dropdown component on width < 600px', async () => {
    const { getByText, getByPlaceholderText } = render(
      <Provider store={store}>
        <App />
      </Provider>,
    );

    fetch.mockResponse(JSON.stringify({ email: 'test@baerum.kommune.no', type: 'kommune' }));

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
  });
});
