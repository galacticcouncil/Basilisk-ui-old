import { ApiPromise } from '@polkadot/api';
import {
  getMockApiPromise,
  mockedLockedNativeBalance,
} from '../../polkadotJs/tests/mockUsePolkadotJsContext';
import { getNativeLockedBalance } from './getLockedBalancesByLockId';

const address = 'bXmoSgp2Vtvctj5c292YDYu1vcYC4A5Hs1gdMjRhfXUf7Ht6x';

describe('getLockedBalancesByLockId', () => {
  describe('getNativeLockedBalance', () => {
    it('can return lockedBalance for native token balance', async () => {
      const mockApiInstance = getMockApiPromise();

      const lockedNativeBalance = await getNativeLockedBalance(
        mockApiInstance,
        address
      );

      expect(lockedNativeBalance).toEqual({
        assetId: '0',
        balance: mockedLockedNativeBalance[0].amount,
        lockId: mockedLockedNativeBalance[0].id,
      });
    });

    it('can return undefined if there is no locked balance', async () => {
      const mockApiInstance = {
        query: {
          balances: {
            locks: jest.fn(() => []),
          },
        },
      } as unknown as ApiPromise;

      const undefinedLockedNativeBalance = await getNativeLockedBalance(
        mockApiInstance,
        address
      );

      expect(undefinedLockedNativeBalance).toBe(undefined);
    });
  });
});
