import { ApiPromise } from '@polkadot/api';
import { Constants } from '../../../generated/graphql';
import { getConstants } from './getConstants';
import {
  getMockApiPromise,
  mockedRepayFee,
} from '../../polkadotJs/tests/mockUsePolkadotJsContext';

describe('getConstants', () => {
  let mockApiInstance: ApiPromise;

  beforeEach(() => {
    mockApiInstance = getMockApiPromise();
  });

  it('can retrieve lbp.getRepayFee constant', () => {
    mockApiInstance.createType = jest
      .fn()
      .mockImplementation(() => ({ toHuman: jest.fn(() => mockedRepayFee) }));

    const chainConstants: Constants = getConstants(mockApiInstance);

    expect(chainConstants.lbp.repayFee).toEqual(mockedRepayFee);
  });
});
