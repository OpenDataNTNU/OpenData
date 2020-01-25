import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Header } from '../../src/sharedComponents/Header';

describe('Template component', () => {
  // mock store and history
  let store;
  let history;

  beforeEach(() => {
    // Set up mock state store
    const mockStore = configureStore();
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);

    // Set up mock history object
    history = createMemoryHistory();
  });

  it('should render the dropdown component on width < 600px', async () => {
    const { queryByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Header />
        </Router>
      </Provider>,
    );

    // The dropdown component should not be rendered when the width
    // is bigger than 600px
    let dropdownElement = queryByText(/Navigation/i);
    expect(dropdownElement).not.toBeInTheDocument();

    // Change the page width
    await wait(() => {
      // Change the viewport to 500px.
      global.innerWidth = 500;
      // Trigger the window resize event.
      global.dispatchEvent(new Event('resize'));
    });

    // The dropdown component should be rendered now that
    // the width is less than 600px
    dropdownElement = queryByText(/Navigation/i);
    expect(dropdownElement).toBeInTheDocument();
  });
});
