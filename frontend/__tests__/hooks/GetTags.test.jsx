import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';

import { useGetTags } from '../../src/sharedComponents/hooks';

global.fetch = fetch;

describe('useGetTags custom hook should', () => {
  // Component to test the hook
  const TestComponent = () => {
    const tags = useGetTags();

    return (
      tags
        ? tags.map((tag) => <p key={tag}>{tag}</p>)
        : <p>No Tags</p>
    );
  };

  // Redux store
  let store;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore([thunk]);
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);
  });

  it('return tags on successful fetch', async () => {
    // Mock fetch response
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

    // Render component and wait for tags to render
    let GetByText;
    await wait(() => {
      const { getByText } = render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
      );
      GetByText = getByText;
    });

    // Check that all 3 tags is rendered
    const tag1 = GetByText('Public activity');
    const tag2 = GetByText('Public property');
    const tag3 = GetByText('Traffic');

    expect(tag1).toBeInTheDocument();
    expect(tag2).toBeInTheDocument();
    expect(tag3).toBeInTheDocument();
  });

  it('dispatch error message on fetch failure', async () => {
    fetch.mockReject(JSON.stringify({
      error: 'Error',
      status: 500,
    }));

    // Render test component and wait for fetch request to finish.
    await wait(() => {
      render(
        <Provider store={store}>
          <TestComponent />
        </Provider>,
      );
    });

    // Check that the error is dispatched on fetch error
    const expectedActions = store.getActions();
    expect(expectedActions.length).toBe(1);
    expect(expectedActions[0]).toEqual({
      message: 'Failed to retrieve tags. Please try again later.',
      type: 'ALERT_ERROR',
    });
  });
});
