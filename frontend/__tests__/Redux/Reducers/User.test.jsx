import { user as userReducer } from '../../../src/state/reducers/user';
import { userConstants } from '../../../src/state/constants/user';

describe('user reducer', () => {
  const user = {
    email: 'test@test.com',
    type: 'kommune',
  };

  it('should return the initial state', () => {
    expect(userReducer(undefined, {})).toEqual({});
  });

  it('should handle login request', () => {
    expect(
      userReducer(undefined, {
        type: userConstants.SET_USER_LOGIN_REQUEST,
      }),
    ).toEqual(
      {
        loggingIn: true,
      },
    );
  });

  it('should handle login success', () => {
    expect(
      userReducer(undefined, {
        type: userConstants.SET_USER_LOGIN_SUCCESS,
        user,
      }),
    ).toEqual(
      {
        loggedIn: true,
        user,
      },
    );
  });

  it('should handle login failure', () => {
    expect(
      userReducer(undefined, {
        type: userConstants.SET_USER_LOGIN_FAILURE,
      }),
    ).toEqual({});
  });

  it('should handle registration request', () => {
    expect(
      userReducer(undefined, {
        type: userConstants.SET_USER_REGISTRATION_REQUEST,
      }),
    ).toEqual(
      {
        registering: true,
      },
    );
  });

  it('should handle login success', () => {
    expect(
      userReducer(undefined, {
        type: userConstants.SET_USER_REGISTRATION_SUCCESS,
        user,
      }),
    ).toEqual(
      {
        registrated: true,
        user,
      },
    );
  });

  it('should handle login failure', () => {
    expect(
      userReducer(undefined, {
        type: userConstants.SET_USER_REGISTRATION_FAILURE,
      }),
    ).toEqual({});
  });
});
