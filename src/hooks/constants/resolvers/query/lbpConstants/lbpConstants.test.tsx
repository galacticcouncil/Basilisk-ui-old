import { ApiPromise } from '@polkadot/api';
import { getRepayFee, GetRepayFee } from '../../../lib/getRepayFee';
import { lbpConstantsQueryResolverFactory } from './lbpConstants';
import errors from '../../../../../errors';

jest.mock('../../../lib/getRepayFee');

describe('lbpConstants', () => {
  describe('lbpConstantsQueryResolverFactory', () => {
    describe('success case', () => {
      it('resolves lbpConstants with apiInstance', () => {
        const getRepayFeeMock =
          getRepayFee as unknown as jest.MockedFunction<GetRepayFee>;
        getRepayFeeMock.mockReturnValueOnce({
          numerator: 'mock',
          denominator: 'mock',
        });
        const lbpConstants = lbpConstantsQueryResolverFactory(
          {} as unknown as ApiPromise
        )();

        expect(lbpConstants).toEqual({
          repayFee: {
            numerator: expect.any(String),
            denominator: expect.any(String),
          },
        });
      });
    });

    describe('fail case', () => {
      it('fails to resolve with missing ApiInstance', () => {
        let brokenApiInstance: undefined = undefined;
        const lbpConstantsQueryResolver =
          lbpConstantsQueryResolverFactory(brokenApiInstance);

        expect(lbpConstantsQueryResolver).toThrowError(
          errors.apiInstanceNotInitialized
        );
      });
    });
  });
});
