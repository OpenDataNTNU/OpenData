import { alert as alertReducer} from '../../../src/state/reducers/alert';
import { alertConstants } from '../../../src/state/constants/alert';

describe('alert reducer', () => {
    it('should return the initial state', () => {
        expect(alertReducer(undefined, {})).toEqual({});
    });

    it('should handle success', () => {
        expect(
            alertReducer(undefined, {
                type: alertConstants.SUCCESS,
                message: "Test success"
            })
        ).toEqual(
            {
                type: 'alert-success',
                message: "Test success"
            }
        );
    });

    it('should handle info', () => {
        expect(
            alertReducer(undefined, {
                type: alertConstants.INFO,
                message: "Test info"
            })
        ).toEqual(
            {
                type: 'alert-info',
                message: "Test info"
            }
        );
    });

    it('should handle error', () => {
        expect(
            alertReducer(undefined, {
                type: alertConstants.ERROR,
                message: "Test error"
            })
        ).toEqual(
            {
                type: 'alert-error',
                message: "Test error"
            }
        );
    });

    it('should handle error/info/success when alert already exists in state', () => {
        expect(
            alertReducer({
                type: 'alert-info',
                message: "Test info"
            }, {
                type: alertConstants.ERROR,
                message: "Test error"
            })
        ).toEqual(
            {
                type: 'alert-error',
                message: "Test error"
            }
        );

        expect(
            alertReducer({
                type: 'alert-succcess',
                message: "Test success"
            }, {
                type: alertConstants.ERROR,
                message: "Test error"
            })
        ).toEqual(
            {
                type: 'alert-error',
                message: "Test error"
            }
        );
    });

    it('should handle clear', () => {
        expect(
            alertReducer({
                type: 'alert-info',
                message: "Test info"
            }, {
                type: alertConstants.CLEAR
            })
        ).toEqual(
            {}
        );
    });

});