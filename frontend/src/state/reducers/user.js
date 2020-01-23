import { userConstants } from '../constants/user';

function user(state = {}, action) {
  switch (action.type) {
    case userConstants.SET_USER_REQUEST:
      return {
        loggingIn: true,
      };
    case userConstants.SET_USER_SUCCESS:
      return {
        loggedIn: true,
        user: action.user,
      };
    case userConstants.SET_USER_FAILURE:
      return {};
    default:
      return state;
  }
}

export {
  user,
};
