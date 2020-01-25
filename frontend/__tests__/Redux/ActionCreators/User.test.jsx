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
    fetch.mockReject(JSON.stringify({
      type: 'credentials_incorrect',
      description: 'Provided credentials were incorrect.',
    }));

    return store.dispatch(userActions.login('test@baerum.kommune.no', 'TEST'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(3);
        expect(expectedActions[0]).toEqual({ type: 'USER_SET_USER_LOGIN_REQUEST' });
        expect(expectedActions[1]).toEqual({ type: 'USER_SET_USER_LOGIN_FAILURE', error: JSON.stringify({ type: 'credentials_incorrect', description: 'Provided credentials were incorrect.' }) });
      });
  });

  it('should return registrated and a user object on registration success', () => {
    fetch.mockResponse(JSON.stringify({ email: 'test@baerum.kommune.no', type: 'kommune' }));

    return store.dispatch(userActions.register('test@baerum.kommune.no', 'TEST', 'kommune'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(2);
        expect(expectedActions[0]).toEqual({ type: 'USER_SET_USER_REGISTRATION_REQUEST' });
        expect(expectedActions[1]).toEqual({
          type: 'USER_SET_USER_REGISTRATION_SUCCESS',
          user: {
            email: 'test@baerum.kommune.no',
            type: 'kommune',
          },
        });
      });
  });

  it('should return an empty state on registration failure', () => {
    fetch.mockReject(JSON.stringify({
      type: 'credentials_email_not_matching_type',
      description: 'The provided email is not a certified kommune email and thus you can not register a kommune account.',
    }));

    return store.dispatch(userActions.register('test@test.com', 'TEST'))
      .then(() => {
        const expectedActions = store.getActions();
        expect(expectedActions.length).toBe(3);
        expect(expectedActions[0]).toEqual({ type: 'USER_SET_USER_REGISTRATION_REQUEST' });
        expect(expectedActions[1]).toEqual({
          type: 'USER_SET_USER_REGISTRATION_FAILURE',
          error: JSON.stringify({
            type: 'credentials_email_not_matching_type',
            description: 'The provided email is not a certified kommune email and thus you can not register a kommune account.',
          }),
        });
      });
  });
});
