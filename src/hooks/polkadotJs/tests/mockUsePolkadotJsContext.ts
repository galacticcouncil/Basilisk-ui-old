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

export const mockedLockedNativeBalance = [
  {
    id: 'ormlvest',
    amount: '3000000000000',
  },
];

export const mockedTokensLocks = [
  [
    ['bXmoSgp2Vtvctj5c292YDYu1vcYC4A5Hs1gdMjRhfXUf7Ht6x', '1'],
    [
      {
        id: 'lbpcllct',
        amount: '20000',
      },
    ],
  ],
];

export const getMockApiPromise = () =>
  ({
    query: {
      balances: {
        locks: jest.fn(() => mockedLockedNativeBalance),
      },
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
        locks: jest.fn(() => mockedTokensLocks),
      },
    },
  } as unknown as ApiPromise);

export const mockUsePolkadotJsContext = {
  apiInstance: getMockApiPromise(),
  loading: false,
};
