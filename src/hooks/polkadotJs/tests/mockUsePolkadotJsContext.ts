import { ApiPromise } from '@polkadot/api';

export const nativeAssetBalance = '10';
export const nonNativeAssetBalance = '20';

const mockedAccountInfoNativeBalance = {
  data: {
    free: nativeAssetBalance,
  },
};

const mockedAccountInfoNonNativeBalance = {
  free: nonNativeAssetBalance,
};

export const getMockApiPromise = () =>
  ({
    query: {
      system: {
        account: jest.fn(() => mockedAccountInfoNativeBalance),
      },
      tokens: {
        accounts: {
          multi: jest.fn((arg: (unknown[] | unknown)[]) =>
            arg.map((_arg) => {
              return mockedAccountInfoNonNativeBalance;
            })
          ),
        },
      },
    },
  } as unknown as ApiPromise);

export const mockUsePolkadotJsContext = () => ({
  apiInstance: getMockApiPromise(),
  loading: false,
});

export const mockedUsePolkadotJsContext = mockUsePolkadotJsContext();
