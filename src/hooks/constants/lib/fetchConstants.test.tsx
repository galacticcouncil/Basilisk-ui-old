import { ApiPromise } from '@polkadot/api';
import { Constants } from '../../../generated/graphql';
import { fetchConstants } from './fetchConstants';
import {
  getMockApiPromise,
  mockedRepayFee,
} from '../../polkadotJs/tests/mockUsePolkadotJsContext';

describe('fetch chain constants', () => {
  let mockApiInstance: ApiPromise;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiInstance = getMockApiPromise();
  });

  it('can retrieve lbp.getRepayFee constant', () => {
    mockApiInstance.createType = jest
      .fn()
      .mockImplementation(() => ({ toHuman: jest.fn(() => mockedRepayFee) }));

    const chainConstants: Constants = fetchConstants(mockApiInstance);

    expect(chainConstants.lbp.repayFee).toEqual({
      numerator: '2',
      denominator: '10',
    });
  });
});
