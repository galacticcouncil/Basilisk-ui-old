import { ApiPromise } from '@polkadot/api';
import { Balance } from '../../../generated/graphql';
import constants from '../../../constants';
import {
  getBalancesByAddress,
  fetchNativeAssetBalance,
  fetchNonNativeAssetBalancesByAssetIds,
  fetchNonNativeAssetBalances,
} from './getBalancesByAddress';

const nativeAssetBalance = '10';
const nonNativeAssetBalance = '20';
const mockedAccountInfoNativeBalanceReturn = {
  data: {
    free: nativeAssetBalance,
  },
};
const mockedAccountInfoNonNativeBalanceReturn = {
  free: nonNativeAssetBalance,
};
const mockedAccountInfoNativeBalance = jest.fn();
const mockedAccountInfoNonNativeBalanceMulti = jest.fn();
const mockedAccountInfoNonNativeBalanceEntries = jest.fn();

const getMockApiPromise = () =>
  ({
    query: {
      system: {
        account: mockedAccountInfoNativeBalance,
      },
      tokens: {
        accounts: {
          multi: mockedAccountInfoNonNativeBalanceMulti,
          entries: mockedAccountInfoNonNativeBalanceEntries,
        },
      },
    },
  } as unknown as ApiPromise);

describe('getBalancesByAddress', () => {
  const address = 'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak';
  let mockApiInstance: ApiPromise;
  const nativeAssetId = '0';
  const nonNativeAssetIdA = '1';
  const nonNativeAssetIdB = '2';

  beforeEach(() => {
    mockApiInstance = getMockApiPromise();

    mockedAccountInfoNativeBalance.mockReturnValueOnce(
      mockedAccountInfoNativeBalanceReturn
    );
    mockedAccountInfoNonNativeBalanceMulti.mockImplementationOnce(
      (arg: (unknown[] | unknown)[]) =>
        arg.map((_arg) => {
          return mockedAccountInfoNonNativeBalanceReturn;
        })
    );
    mockedAccountInfoNonNativeBalanceEntries.mockImplementationOnce(() => {
      return [
        [
          { toHuman: () => [address, nonNativeAssetIdA] },
          mockedAccountInfoNonNativeBalanceReturn,
        ],
        [
          { toHuman: () => [address, nonNativeAssetIdB] },
          mockedAccountInfoNonNativeBalanceReturn,
        ],
      ];
    });
  });

  describe('getBalancesByAddress', () => {
    it('can retrieve native asset balance', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        [nativeAssetId]
      );

      expect(balances).toEqual([
        {
          assetId: nativeAssetId,
          balance: nativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledWith(
        address
      );
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(1);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        0
      );
      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledTimes(0);
    });

    it('can retrieve 1 non-native asset balance', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        [nonNativeAssetIdA]
      );

      expect(balances).toEqual([
        {
          assetId: nonNativeAssetIdA,
          balance: nonNativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(0);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        1
      );
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledWith([
        [address, nonNativeAssetIdA],
      ]);
      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledTimes(0);
    });

    it('can retrieve multiple non-native asset balances', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        [nonNativeAssetIdA, nonNativeAssetIdB]
      );

      expect(balances).toEqual([
        {
          assetId: nonNativeAssetIdA,
          balance: nonNativeAssetBalance,
        },
        {
          assetId: nonNativeAssetIdB,
          balance: nonNativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(0);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        1
      );
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledWith([
        [address, nonNativeAssetIdA],
        [address, nonNativeAssetIdB],
      ]);
      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledTimes(0);
    });

    it('can retrieve 1 native and 1 non-native asset balances', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        [nativeAssetId, nonNativeAssetIdA]
      );

      expect(balances).toEqual([
        {
          assetId: nativeAssetId,
          balance: nativeAssetBalance,
        },
        {
          assetId: nonNativeAssetIdA,
          balance: nonNativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledWith(
        address
      );
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(1);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        1
      );
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledWith([
        [address, nonNativeAssetIdA],
      ]);
      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledTimes(0);
    });

    it('can retrieve non-native asset balances when no assetIds are provided', async () => {
      const balances: Balance[] = await getBalancesByAddress(
        mockApiInstance,
        address,
        []
      );

      expect(balances).toEqual([
        {
          assetId: nonNativeAssetIdA,
          balance: nonNativeAssetBalance,
        },
        {
          assetId: nonNativeAssetIdB,
          balance: nonNativeAssetBalance,
        },
      ]);
      expect(mockApiInstance.query.system.account).toHaveBeenCalledTimes(0);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(
        0
      );
      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledTimes(1);
      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledWith(address);
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
      expect(mockApiInstance.query.system.account).toHaveBeenCalledWith(
        address
      );
    });
  });

  describe('fetchNonNativeAssetBalancesByAssetIds', () => {
    it('can fetch non-native asset balances for address and given assetIds', async () => {
      const balance: Balance[] = await fetchNonNativeAssetBalancesByAssetIds(
        mockApiInstance,
        address,
        [nonNativeAssetIdA, nonNativeAssetIdB]
      );

      expect(balance).toEqual([
        {
          assetId: nonNativeAssetIdA,
          balance: nonNativeAssetBalance,
        },
        { assetId: nonNativeAssetIdB, balance: nonNativeAssetBalance },
      ]);
      // assigns assetId in the correct order
      expect(balance[0].assetId).not.toEqual(nonNativeAssetIdB);
      expect(balance[1].assetId).not.toEqual(nonNativeAssetIdA);
      expect(mockApiInstance.query.tokens.accounts.multi).toHaveBeenCalledWith([
        [address, nonNativeAssetIdA],
        [address, nonNativeAssetIdB],
      ]);
    });
  });
  describe('fetchNonNativeAssetBalances', () => {
    it('can fetch non-native asset balances for address and given assetIds', async () => {
      const balance: Balance[] = await fetchNonNativeAssetBalances(
        mockApiInstance,
        address
      );

      expect(balance).toEqual([
        {
          assetId: nonNativeAssetIdA,
          balance: nonNativeAssetBalance,
        },
        { assetId: nonNativeAssetIdB, balance: nonNativeAssetBalance },
      ]);

      expect(
        mockApiInstance.query.tokens.accounts.entries
      ).toHaveBeenCalledWith(address);
    });
  });
});
