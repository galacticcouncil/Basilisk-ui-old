import { ApiPromise } from '@polkadot/api';
import { AccountId32 } from '@polkadot/types/interfaces';
import { Balance } from '../../../generated/graphql';
import { getBalancesByAddress } from './getBalancesByAddress';

const getApiPromise = () =>
  ({
    query: {
      system: {
        account: jest.fn((arg: AccountId32 | string | Uint8Array) => {
          return {
            data: {
              free: '1000000000000000000000000',
            },
          };
        }),
      },
      tokens: {
        accounts: {
          multi: jest.fn((arg: (unknown[] | unknown)[]) => {
            return 'result';
          }),
          entries: jest.fn((arg: unknown[]) => {
            return 'result';
          }),
        },
      },
    },
  } as unknown as ApiPromise);

describe('getBalancesByAddress', () => {
  describe('for native asset', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('can retrieve native asset balance without providing assetId', async () => {
      const apiInstance = getApiPromise();

      const balances: Balance[] = await getBalancesByAddress(
        apiInstance,
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak'
      );

      expect(balances).toEqual([
        {
          assetId: '0',
          balance: '1000000000000000000000000',
        },
      ]);
      expect(apiInstance.query.system.account).toHaveBeenCalledTimes(1);
      expect(apiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(0);
      expect(apiInstance.query.tokens.accounts.entries).toHaveBeenCalledTimes(
        0
      );
    });

    it('can retrieve native asset balance for explicitly provided assetId', async () => {
      const apiInstance = getApiPromise();

      const balances: Balance[] = await getBalancesByAddress(
        apiInstance,
        'bXmPf7DcVmFuHEmzH3UX8t6AUkfNQW8pnTeXGhFhqbfngjAak',
        ['0']
      );

      expect(balances).toEqual([
        {
          assetId: '0',
          balance: '1000000000000000000000000',
        },
      ]);
      expect(apiInstance.query.system.account).toHaveBeenCalledTimes(1);
      expect(apiInstance.query.tokens.accounts.multi).toHaveBeenCalledTimes(0);
      expect(apiInstance.query.tokens.accounts.entries).toHaveBeenCalledTimes(
        0
      );
    });
  });

  describe('for any custom asset', () => {
    it.skip('can retrieve custom asset balance with explicitly provided assetId', () => {});

    it.skip('can retrieve multiple balances for explicitly provided assetIds', () => {});
  });
});
