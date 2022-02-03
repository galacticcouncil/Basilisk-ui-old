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
      parachainSystem: {
        validationData: jest.fn(),
      },
    },
    derive: {
      chain: {
        subscribeNewBlocks: jest.fn(),
      },
    },
    createType: jest.fn(),
    at: jest.fn(),
  } as unknown as ApiPromise);

export const mockUsePolkadotJsContext = () => ({
  apiInstance: getMockApiPromise(),
  loading: false,
});

export const mockedUsePolkadotJsContext = mockUsePolkadotJsContext();
