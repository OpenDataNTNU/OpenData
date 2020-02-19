import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { ErrorBoundary } from './ErrorBoundary';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { store } from './state/store';
import { saveState } from './state/helpers/localstorage';


store.subscribe(() => {
  saveState(store.getState());
});

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
