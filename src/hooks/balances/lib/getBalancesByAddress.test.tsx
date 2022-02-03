import { ApiPromise } from '@polkadot/api';
import { Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import {
  getBalancesByAddress,
  fetchNativeAssetBalance,
  fetchNonNativeAssetBalances,
} from './getBalancesByAddress';
import {
  getMockApiPromise,
  nativeAssetBalance,
  nonNativeAssetBalance,
} from '../../polkadotJs/tests/mockUsePolkadotJsContext';

const address = 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak';

describe('getBalancesByAddress', () => {
  let mockApiInstance: ApiPromise;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiInstance = getMockApiPromise();
  });

  describe('getBalancesByAddress', () => {
    it('can retrieve native asset balance', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        ['0']
      );

      expect(balances).toEqual([
        {
          assetId: '0',
          balance: nativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(1);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        0
      );
    });

    it('can retrieve 1 non-native asset balance', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        ['1']
      );

      expect(balances).toEqual([
        {
          assetId: '1',
          balance: '20',
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(0);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        1
      );
    });

    it('can retrieve multiple non-native asset balances', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        ['1', '2']
      );

      expect(balances).toEqual([
        {
          assetId: '1',
          balance: nonNativeAssetBalance,
        },
        {
          assetId: '2',
          balance: nonNativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(0);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        1
      );
    });

    it('can retrieve 1 native and 1 non-native asset balances', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        ['0', '1']
      );

      expect(balances).toEqual([
        {
          assetId: '0',
          balance: nativeAssetBalance,
        },
        {
          assetId: '1',
          balance: nonNativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(1);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        1
      );
    });
  });

  describe('fetchNativeAssetBalance', () => {
    it('can fetch native asset balance for address', async () => {
      const balance: Balance = await fetchNativeAssetBalance(
        mockApiInstance,
        address
      );

      expect(balance).toEqual({
        assetId: constants.nativeAssetId,
        balance: nativeAssetBalance,
      });
    });
  });

  describe('fetchNonNativeAssetBalances', () => {
    it('can fetch non-native asset balances for address and given assetIds', async () => {
      const balance: Balance[] = await fetchNonNativeAssetBalances(
        mockApiInstance,
        address,
        ['1', '2']
      );

      expect(balance).toEqual([
        {
          assetId: '1',
          balance: nonNativeAssetBalance,
        },
        { assetId: '2', balance: nonNativeAssetBalance },
      ]);
      // assigns assetId in the correct order
      expect(balance[0].assetId).not.toEqual('2');
      expect(balance[1].assetId).not.toEqual('1');
    });
  });
});
