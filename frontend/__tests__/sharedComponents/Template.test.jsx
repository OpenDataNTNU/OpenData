import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import { Template } from '../../src/sharedComponents/Template';

describe('Template component', () => {
  // Mock store and history
  let store;
  let history;

  beforeEach(() => {
    // Set up mock state stpre
    const mockStore = configureStore();
    // Initialize mockstore with empty state
    const initialEmptyState = {};
    store = mockStore(initialEmptyState);

    // Set up mock history object
    history = createMemoryHistory();
  });

  it('should render the header, children, and the footer in that order', () => {
    const { container } = render(
      <Provider store={store}>
        <Router history={history}>
          <Template>
            <h1>Test</h1>
          </Template>
        </Router>
      </Provider>,
    );

    // We expect the header, h1, and footer elements to be rendered,
    // thus the length of the children should be 3
    expect(container.firstChild.children.length).toBe(4);
  });

  it('should render the h1 as a child', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Router history={history}>
          <Template>
            <h1>Test</h1>
          </Template>
        </Router>
      </Provider>,
    );

    // The h1 should be rendered on the page
    const headerElement = getByText(/Test/i);
    expect(headerElement).toBeInTheDocument();
  });
});
