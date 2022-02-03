import { ApiPromise } from '@polkadot/api';
import { AccountId32 } from '@polkadot/types/interfaces';

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

export const mockUsePolkadotJsContext = {
  apiInstance: getMockApiPromise(),
  loading: false,
};
