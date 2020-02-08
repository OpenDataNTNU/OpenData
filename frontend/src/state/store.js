import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { rootReducer } from './reducers';

import { loadState } from './helpers/localstorage';

const persistedState = loadState();
const loggerMiddleware = createLogger();

// Add thunkmiddleware, and loggermiddleware if on a development build
let middleware;
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  middleware = applyMiddleware(
    thunkMiddleware,
    loggerMiddleware,
  );
} else {
  middleware = applyMiddleware(
    thunkMiddleware,
  );
}

const store = createStore(
  rootReducer,
  persistedState,
  middleware,
);

export {
  store,
};
