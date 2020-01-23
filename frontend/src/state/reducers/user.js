import { userConstants } from '../constants/user';

function user(state = {}, action) {
  switch (action.type) {
    case userConstants.SET_USER_LOGIN_REQUEST:
      return {
        loggingIn: true,
      };
    case userConstants.SET_USER_LOGIN_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case userConstants.SET_USER_LOGIN_FAILURE:
      return {};
    case userConstants.SET_USER_REGISTRATION_REQUEST:
      return {
        registering: true,
      };
    case userConstants.SET_USER_REGISTRATION_SUCCESS:
      return {
        registrated: true,
        user: action.user,
      };
    case userConstants.SET_USER_REGISTRATION_FAILURE:
      return {};
    default:
      return state;
  }
}

export {
  user,
};
