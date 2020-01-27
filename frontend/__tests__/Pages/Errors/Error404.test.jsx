import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Route, Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Error404 } from '../../../src/pages/Errors/Error404';

describe('Template component', () => {
  // mock store and history
  let store;
  let history;

  beforeAll(() => {
    // Set up mock state store
    const mockStore = configureStore();
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);

    // Set up mock history object
    history = createMemoryHistory();
  });

  beforeEach(() => {
    store.clearActions();
  });

  it('should render the dropdown component on width < 600px', async () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Route exact path="/">
            <h1>Test</h1>
          </Route>
          <Route>
            <Error404 />
          </Route>
        </Router>
      </Provider>,
    );

    expect(history.location.pathname).toBe('/');

    await wait(() => {
      history.push('/fljsdlfjsldkjfsdf');
    });

    expect(history.location.pathname).toBe('/fljsdlfjsldkjfsdf');
    const H2 = getByText('OOPS!');
    expect(H2).toBeInTheDocument();

    await wait(() => {
      fireEvent(
        getByText('Go Back'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    expect(history.location.pathname).toBe('/');
  });
});
