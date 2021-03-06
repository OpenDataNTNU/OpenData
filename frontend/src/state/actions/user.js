import { userConstants } from '../constants/user';
import { userService } from '../services/user';
import { alertActions } from './alert';

// Login a user with email and password
function login(email, password) {
  function request() {
    return {
      type: userConstants.SET_USER_LOGIN_REQUEST,
    };
  }

  function success(user) {
    return {
      type: userConstants.SET_USER_LOGIN_SUCCESS,
      user,
    };
  }

  function failure(error) {
    return {
      type: userConstants.SET_USER_LOGIN_FAILURE,
      error,
    };
  }

  return async (dispatch) => {
    dispatch(request());

    try {
      const user = await userService.login(email, password);
      dispatch(success(user));
    } catch (error) {
      dispatch(failure(error.message));
      dispatch(alertActions.error(error.message));
    }
  };
}

// Register a user with email and password
function register(email, password, type) {
  function request() {
    return {
      type: userConstants.SET_USER_REGISTRATION_REQUEST,
    };
  }

  function success() {
    return {
      type: userConstants.SET_USER_REGISTRATION_SUCCESS,
    };
  }

  function failure(error) {
    return {
      type: userConstants.SET_USER_REGISTRATION_FAILURE,
      error,
    };
  }

  return async (dispatch) => {
    dispatch(request());

    try {
      await userService.register(email, password, type);
      dispatch(success());
    } catch (error) {
      dispatch(failure(error.message));
      dispatch(alertActions.error(error.message));
    }
  };
}

// Resets the user object to an empty object
function clearUserObject() {
  return { type: userConstants.SET_USER_CLEAR };
}

// Logs out the user by clearing the user object
function logout() {
  return { type: userConstants.SET_USER_LOGOUT };
}

const userActions = {
  login,
  register,
  logout,
  clearUserObject,
};

export {
  userActions,
};
