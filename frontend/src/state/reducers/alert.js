import { alertConstants } from '../constants/alert';

function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.SUCCESS:
      return {
        type: 'alert-success',
        message: action.message,
      };
    case alertConstants.INFO:
      return {
        type: 'alert-info',
        message: action.message,
      };
    case alertConstants.ERROR:
      return {
        type: 'alert-error',
        message: action.message,
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state;
  }
}

export {
  alert,
};
