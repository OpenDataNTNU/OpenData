import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import fetch from 'jest-fetch-mock';

import { userActions } from '../../../src/state/actions/user';

global.fetch = fetch;

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
const initialEmptyState = {};
const store = mockStore(initialEmptyState);

describe('User action creator', () => {
  beforeEach(() => {
    fetch.resetMocks();
    store.clearActions();
  });

  it('should return loggedIn and a user object on login success', () => {
    fetch.mockResponse(JSON.stringify({ email: 'test@baerum.kommune.no', type: 'kommune' }));

    return store.dispatch(userActions.login('test@baerum.kommune.no', 'TEST'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions[0]).toEqual({ type: 'USER_SET_USER_LOGIN_REQUEST' });
        expect(expectedActions[1]).toEqual({ type: 'USER_SET_USER_LOGIN_SUCCESS', user: { email: 'test@baerum.kommune.no', type: 'kommune' } });
      });
  });

  it('should return an empty state on login failure', () => {
    const error = JSON.stringify({
      type: 'credentials_incorrect',
      message: 'Provided credentials were incorrect.',
    });

    fetch.mockReject(error);

    return store.dispatch(userActions.login('test@baerum.kommune.no', 'TEST'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(3);
        expect(expectedActions[0]).toEqual({
          type: 'USER_SET_USER_LOGIN_REQUEST',
        });
        expect(expectedActions[1]).toEqual({
          type: 'USER_SET_USER_LOGIN_FAILURE',
        });
      });
  });

  it('should return registrated on registration success', () => {
    fetch.mockResponseOnce(
      JSON.stringify({ token: 'lfkmasfDFDFSAsldf21p4jl2fsdf' }),
      { status: 201, headers: { 'content-type': 'application/json' } },
    );

    return store.dispatch(userActions.register('test@baerum.kommune.no', 'TEST'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions[0]).toEqual({ type: 'USER_SET_USER_REGISTRATION_REQUEST' });
        expect(expectedActions[1]).toEqual({
          type: 'USER_SET_USER_REGISTRATION_SUCCESS',
        });
      });
  });

  it('should return an empty state on registration failure', () => {
    const error = JSON.stringify({
      message: 'The provided email is not a certified kommune email and thus you can not register a kommune account.',
    });

    fetch.mockReject(error);

    return store.dispatch(userActions.register('test@test.com', 'TEST'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(3);
        expect(expectedActions[0]).toEqual({ type: 'USER_SET_USER_REGISTRATION_REQUEST' });
        expect(expectedActions[1]).toEqual({
          type: 'USER_SET_USER_REGISTRATION_FAILURE',
        });
      });
  });
});
