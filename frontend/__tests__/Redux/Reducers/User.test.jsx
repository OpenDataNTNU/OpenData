import { user as userReducer} from '../../../src/state/reducers/user';

describe('user reducer', () => {
  it('should return the initial state', () => {
      expect(userReducer(undefined, {})).toEqual({});
  });
});