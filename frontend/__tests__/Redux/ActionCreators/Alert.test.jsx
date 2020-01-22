import { alertActions } from '../../../src/state/actions/alert';
import { alertConstants } from '../../../src/state/constants/alert';

describe('Alert action creator', () => {
  it('should create an action to add an info alert', () => {
    const message = 'This is an info text';
    const expectedAction = {
      type: alertConstants.INFO,
      message
    };
    expect(alertActions.info(message)).toEqual(expectedAction);
  });

  it('should create an action to add an succcess alert', () => {
    const message = 'This is an info text';
    const expectedAction = {
      type: alertConstants.SUCCESS,
      message
    };
    expect(alertActions.success(message)).toEqual(expectedAction);
  });

  it('should create an action to add an error alert', () => {
    const message = 'This is an info text';
    const expectedAction = {
      type: alertConstants.ERROR,
      message
    };
    expect(alertActions.error(message)).toEqual(expectedAction);
  });

  it('should create an action to clear all alerts', () => {
    const expectedAction = {
      type: alertConstants.CLEAR
    };
    expect(alertActions.clear()).toEqual(expectedAction);
  });
})