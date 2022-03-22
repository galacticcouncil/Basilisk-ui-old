import { ApiPromise } from '@polkadot/api';
import { getRepayFee } from '../../../lib/getRepayFee';
import { lbpConstantsQueryResolverFactory } from './lbpConstants';
import errors from '../../../../../errors';

jest.mock('../../../lib/getRepayFee');

describe('lbpConstants', () => {
  describe('success case', () => {
    const getMockApiPromise = () => ({} as unknown as ApiPromise);
    let apiInstance: ApiPromise;
    const getRepayFeeMock = getRepayFee as unknown as jest.Mock<
      typeof getRepayFee
    >;

    beforeEach(() => {
      apiInstance = getMockApiPromise();
      getRepayFeeMock.mockImplementationOnce(() =>
        jest.fn().mockReturnValueOnce({
          numerator: 'mock',
          denominator: 'mock',
        })()
      );
    });

    it('resolves with apiInstance', () => {
      const lbpConstantsQueryResolver =
        lbpConstantsQueryResolverFactory(apiInstance)();

      expect(lbpConstantsQueryResolver).toEqual({
        repayFee: {
          numerator: expect.anything(),
          denominator: expect.anything(),
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
