import { ApiPromise } from '@polkadot/api';
import { getRepayFee, GetRepayFee } from '../../../lib/getRepayFee';
import { lbpConstantsQueryResolverFactory } from './lbpConstants';
import errors from '../../../../../errors';

jest.mock('../../../lib/getRepayFee');

describe('lbpConstants', () => {
  describe('success case', () => {
    const getMockApiPromise = () => ({} as unknown as ApiPromise);
    let apiInstance: ApiPromise;
    const getRepayFeeMock =
      getRepayFee as unknown as jest.MockedFunction<GetRepayFee>;

    beforeEach(() => {
      apiInstance = getMockApiPromise();
      getRepayFeeMock.mockReturnValueOnce({
        numerator: 'mock',
        denominator: 'mock',
      });
    });

    it('resolves lbpConstants with apiInstance', () => {
      const lbpConstants = lbpConstantsQueryResolverFactory(apiInstance)();

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
