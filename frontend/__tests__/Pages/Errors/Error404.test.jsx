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
    // Clear the actions from the store before each test
    store.clearActions();
  });

  it('should render the dropdown component on width < 600px', async () => {
    // Render the component
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

    // We expect the app to be at path '/'
    expect(history.location.pathname).toBe('/');

    // We change the url to '/fljsdlfjsldkjfsdf' and thus the rendere component
    await wait(() => {
      history.push('/fljsdlfjsldkjfsdf');
    });

    // We expect the path to be '/fljsdlfjsldkjfsdf' and that the 404 error page is rendered
    expect(history.location.pathname).toBe('/fljsdlfjsldkjfsdf');
    const H2 = getByText('OOPS!');
    expect(H2).toBeInTheDocument();

    // We click the go back button
    await wait(() => {
      fireEvent(
        getByText('Go Back'),
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      );
    });

    // We expect to be back at our last page which should be '/'
    expect(history.location.pathname).toBe('/');
  });
});
