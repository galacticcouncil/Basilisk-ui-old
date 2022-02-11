import { Account } from '../../../generated/graphql';
import { getAccounts } from './getAccounts';

const mockAccounts = [
  {
    address: '5DwWSMW7kqBUU4Eo6s5dDvpJvKpXRgVZc24DUqqVXHH6UmFt',
    meta: {
      name: 'name',
      source: 'source',
    },
  },
];

jest.mock('@polkadot/extension-dapp', () => ({
  web3Accounts: async () => {
    return mockAccounts;
  },
  web3Enable: async () => {
    return true;
  },
}));

describe('getAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can retrieve accounts', async () => {
    const accounts: Account[] | null = await getAccounts();

    expect(accounts).toEqual([
      {
        name: 'name',
        source: 'source',
        balances: [],
        id: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9',
      },
    ]);
  });
});
