import { ApiPromise } from '@polkadot/api';
import { LockedBalance } from '../../../generated/graphql';
import {
  filterBalancesByLockId,
  getLockedBalancesByLockId,
  getNativeLockedBalances,
  getNonNativeLockedBalances,
} from './getLockedBalancesByLockId';

const address = 'bXmoSgp2Vtvctj5c292YDYu1vcYC4A5Hs1gdMjRhfXUf7Ht6x';

const mockedLockedNativeBalances = jest.fn();
const mockedNonNativeLockedBalances = jest.fn();

export const getMockApiPromise = () =>
  ({
    query: {
      balances: {
        locks: mockedLockedNativeBalances,
      },
      tokens: {
        locks: { entries: mockedNonNativeLockedBalances },
      },
    },
  } as unknown as ApiPromise);

// helper function to assert mock values in API with returned values
export const assertNativeLockedBalances = (
  mockBalances: any[],
  returnedBalances: LockedBalance[]
) => {
  mockBalances.forEach((mockBalance, i) => {
    expect(returnedBalances[i]).toEqual({
      assetId: '0',
      balance: mockBalance.amount,
      lockId: mockBalance.id,
    });
  });
  expect(mockBalances.length).toEqual(returnedBalances.length);
};

describe('getLockedBalancesByLockId', () => {
  let mockApiInstance: ApiPromise;

  const mockLockedNativeBalancesApi = [
    { id: '0x6c6270636c6c6374', amount: 'amount' },
    { id: '0x6f726d6c76657374', amount: 'amount' },
  ];

  const mockLockedNonNativeBalancesApi = [
    [
      { args: ['address', 'assetId'] },
      [
        { id: 'lockId1', amount: '100' },
        { id: 'lockId2', amount: '200' },
      ],
    ],
    [
      { args: ['address', 'assetId2'] },
      [
        { id: 'lockId1', amount: '300' },
        { id: 'lockId3', amount: '400' },
      ],
    ],
  ];

  // TODO write a function that extracts lockedNonNativeBalances from mockLockedNonNativeBalancesApi
  const lockedNonNativeBalances = [
    { lockId: 'lockId1', assetId: 'assetId', balance: '100' },
    { lockId: 'lockId2', assetId: 'assetId', balance: '200' },
    { lockId: 'lockId1', assetId: 'assetId2', balance: '300' },
    { lockId: 'lockId3', assetId: 'assetId2', balance: '400' },
  ];

  beforeEach(() => {
    mockApiInstance = getMockApiPromise();
  });

  describe('getNativeLockedBalance', () => {
    describe('locked balances exists', () => {
      beforeEach(() => {
        mockedLockedNativeBalances.mockReturnValueOnce(
          mockLockedNativeBalancesApi
        );
      });

      it('can fetch locked balances for native tokens', async () => {
        const lockedNativeBalances = await getNativeLockedBalances(
          mockApiInstance,
          address
        );

        assertNativeLockedBalances(
          mockLockedNativeBalancesApi,
          lockedNativeBalances
        );
      });
    });

    describe(`locked balance doesn't exist`, () => {
      beforeEach(() => {
        mockedLockedNativeBalances.mockReturnValue([]);
      });

      it('can return an empty array if there is no locked balance', async () => {
        const emptyArray = await getNativeLockedBalances(
          mockApiInstance,
          address
        );

        expect(emptyArray).toStrictEqual([]);
      });
    });

    describe('getNonNativeLockedBalances', () => {
      describe('locked balance exists', () => {
        beforeEach(() => {
          mockedNonNativeLockedBalances.mockReturnValue(
            mockLockedNonNativeBalancesApi
          );
        });

        it('can fetch locked non native token balances', async () => {
          const nonNativeLockedBalances = await getNonNativeLockedBalances(
            mockApiInstance,
            address
          );

          expect(nonNativeLockedBalances).toStrictEqual(
            lockedNonNativeBalances
          );
        });
      });

      describe(`locked balance doesn't exist`, () => {
        beforeEach(() => {
          mockedNonNativeLockedBalances.mockReturnValue([]);
        });

        it('can return an empty array if there is no locked balance', async () => {
          const emptyArray = await getNonNativeLockedBalances(
            mockApiInstance,
            address
          );

          expect(emptyArray).toStrictEqual([]);
        });
      });
    });

    describe('filterBalancesByLockId', () => {
      it('can filter array by lockId', () => {
        const lockId = 'lockId1';
        const filteredBalances = filterBalancesByLockId(
          lockedNonNativeBalances,
          lockId
        );

        filteredBalances.forEach((balance) =>
          expect(balance.lockId).toEqual(lockId)
        );
        expect(filteredBalances.length).toEqual(2);
      });

      it('can return empty array for not found lockId', () => {
        const lockId = 'unknownLockId';
        const filteredBalances = filterBalancesByLockId(
          lockedNonNativeBalances,
          lockId
        );

        expect(filteredBalances.length).toEqual(0);
      });
    });

    describe('getLockedBalancesByLockId', () => {
      beforeEach(() => {
        mockedLockedNativeBalances.mockReturnValueOnce(
          mockLockedNativeBalancesApi
        );
        mockedNonNativeLockedBalances.mockReturnValueOnce(
          mockLockedNonNativeBalancesApi
        );
      });

      it('can get locked native token balance by lockId', async () => {
        const nativeLockedBalance = await getLockedBalancesByLockId(
          mockApiInstance,
          address,
          mockLockedNativeBalancesApi[0].id
        );

        assertNativeLockedBalances(
          [{ id: '0x6c6270636c6c6374', amount: 'amount' }],
          nativeLockedBalance
        );
        expect(mockedLockedNativeBalances).toHaveBeenCalledTimes(1);
        expect(mockedNonNativeLockedBalances).toHaveBeenCalledTimes(0);
      });

      it('can get locked non native token balance by lockId', async () => {
        const nonNativeLockedBalances = await getLockedBalancesByLockId(
          mockApiInstance,
          address,
          'lockId1'
        );

        expect(nonNativeLockedBalances).toStrictEqual([
          { lockId: 'lockId1', assetId: 'assetId', balance: '100' },
          { lockId: 'lockId1', assetId: 'assetId2', balance: '300' },
        ]);
        expect(mockedLockedNativeBalances).toHaveBeenCalledTimes(1);
        expect(mockedNonNativeLockedBalances).toHaveBeenCalledTimes(1);
      });

      describe.each([
        [
          'lockId1',
          [
            { lockId: 'lockId1', assetId: 'assetId', balance: '100' },
            { lockId: 'lockId1', assetId: 'assetId2', balance: '300' },
          ],
        ],
        [
          'lockId2',
          [{ lockId: 'lockId2', assetId: 'assetId', balance: '200' }],
        ],
      ])(
        'can get locked non native token balance by lockId',
        (lockId, lockedBalances) => {
          test(`for ${lockedBalances.length} locked balances`, async () => {
            const nonNativeLockedBalances = await getLockedBalancesByLockId(
              mockApiInstance,
              address,
              lockId
            );

            expect(nonNativeLockedBalances).toStrictEqual(lockedBalances);
            expect(mockedLockedNativeBalances).toHaveBeenCalledTimes(1);
            expect(mockedNonNativeLockedBalances).toHaveBeenCalledTimes(1);
          });
        }
      );

      it('returns empty array for unknown lockId', async () => {
        const emptyArray = await getLockedBalancesByLockId(
          mockApiInstance,
          address,
          'unknownLockId'
        );

        expect(emptyArray).toStrictEqual([]);
        expect(mockedLockedNativeBalances).toHaveBeenCalledTimes(1);
        expect(mockedNonNativeLockedBalances).toHaveBeenCalledTimes(1);
      });
    });
  });
});
