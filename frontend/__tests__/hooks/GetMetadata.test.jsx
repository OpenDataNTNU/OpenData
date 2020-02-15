import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';

import { useGetMetadata } from '../../src/sharedComponents/hooks';

global.fetch = fetch;

describe('useGetMetadata custom hook should', () => {
  // Component to test the hook
  const TestComponent = () => {
    const metadata = useGetMetadata('08d7b205-43f8-4daf-8f66-5d5c930809ea');

    return (
      <p>{metadata ? metadata.uuid : 'Failed to find metadata'}</p>
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

  it('return metadata on successful fetch', async () => {
    // Mock fetch response
    fetch.mockResponse(JSON.stringify(
      {
        uuid: '08d7b205-43f8-4daf-8f66-5d5c930809ea',
        url: 'http://google.com',
        description: 'Very nice example',
        formatName: 'Json',
        releaseState: 1,
        metadataTypeName: 'Car history',
        municipalityName: 'Asker',
        experiencePostGuid: null,
      },
    ));

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

    // Check that the uuid is rendered
    const uuid = GetByText('08d7b205-43f8-4daf-8f66-5d5c930809ea');

    expect(uuid).toBeInTheDocument();
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
      message: 'Failed to retrieve dataset. Please try again later.',
      type: 'ALERT_ERROR',
    });
  });
});
