import { ApiPromise } from '@polkadot/api';
import { AccountId32 } from '@polkadot/types/interfaces';
import { AssetIds, Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import {
  getBalancesByAddress,
  fetchNativeAssetBalance,
  objectToArrayWithoutNull,
} from './getBalancesByAddress';

export const nativeAssetBalance = '10';
export const nonNativeAssetBalance = '20';

export const getMockApiPromise = () =>
  ({
    query: {
      system: {
        account: jest.fn((arg: AccountId32 | string | Uint8Array) => {
          return {
            data: {
              free: nativeAssetBalance,
            },
          };
        }),
      },
      tokens: {
        accounts: {
          multi: jest.fn((arg: (unknown[] | unknown)[]) => {
            return arg.map((arg) => {
              return { free: nonNativeAssetBalance };
            });
          }),
        },
      },
    },
  } as unknown as ApiPromise);

describe('hooks/balances/lib/getBalancesByAddress', () => {
  let mockApiInstance: ApiPromise;

  beforeEach(() => {
    jest.clearAllMocks();
    mockApiInstance = getMockApiPromise();
  });

  describe('getBalancesByAddress', () => {
    it('can retrieve native asset balance', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak',
        { a: '0' }
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
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak',
        { a: '1' }
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
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak',
        { a: '1', b: '2' }
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
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak',
        { a: '0', b: '1' }
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
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak'
      );

      expect(balance).toEqual({
        assetId: constants.nativeAssetId,
        balance: nativeAssetBalance,
      });
    });
  });

  describe.skip('fetchNonNativeAssetBalances', () => {
    // TODO
  });

  describe('objectToArrayWithoutNull', () => {
    it('can convert an object to an array', () => {
      const assetIds = {
        a: '0',
        b: '1',
      };
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(['0', '1']);
    });

    it('can convert an object to an array with one null value', () => {
      const assetIds: AssetIds = {
        a: '0',
        b: null,
      };
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(['0']);
    });

    it('can convert an object to an array with one undefined value', () => {
      const assetIds: AssetIds = {
        a: '0',
        b: undefined,
      };
      const assets = objectToArrayWithoutNull(assetIds);

      expect(assets).toEqual(['0']);
    });
  });
});
