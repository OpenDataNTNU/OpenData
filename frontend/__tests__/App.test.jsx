import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import App from '../src/App';

const mock = {};

beforeAll(() => {
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);

  // Initialize mockstore with empty state
  const initialEmptyState = {};
  const emptyStore = mockStore(initialEmptyState);
  mock.emptyStore = emptyStore;

  // Initialize mockstore with alert state
  const initialAlertState = {
    alert: {
      type: 'alert-error',
      message: 'ERROR',
    },
  };

  const alertStore = mockStore(initialAlertState);
  mock.alertStore = alertStore;
});

test('renders learn react link', () => {
  const { container, getByText } = render(
    <Provider store={mock.emptyStore}>
      <App />
    </Provider>,
  );

  // Learn react should be rendered
  const linkElement = getByText(/all datasets/i);
  expect(linkElement).toBeInTheDocument();

  // No alert is rendered
  expect(container.children.length).toBe(1);
});

test('renders alert action when dispatched', () => {
  const { container } = render(
    <Provider store={mock.alertStore}>
      <App />
    </Provider>,
  );

  // Alert should be rendered with an alert in the state store
  expect(container.children.length).toBe(2);
});
