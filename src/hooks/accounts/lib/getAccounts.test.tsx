import { Account } from '../../../generated/graphql';
import { getAccounts } from './getAccounts';

const mockWeb3Accounts = jest.fn();
const mockWeb3Enable = jest.fn(async () => {
  return true;
});

jest.mock('@polkadot/extension-dapp', () => ({
  web3Accounts: () => mockWeb3Accounts(),
  web3Enable: () => mockWeb3Enable(),
}));

describe('getAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('can retrieve accounts', async () => {
    mockWeb3Accounts.mockImplementation(() => [
      {
        address: '5DwWSMW7kqBUU4Eo6s5dDvpJvKpXRgVZc24DUqqVXHH6UmFt',
        meta: {
          name: 'name',
          source: 'source',
        },
      },
    ]);
    const accounts: Account[] = await getAccounts();

    expect(accounts).toEqual([
      {
        name: 'name',
        source: 'source',
        balances: [],
        id: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9',
      },
    ]);
    expect(mockWeb3Accounts).toHaveBeenCalledTimes(1);
    expect(mockWeb3Enable).toHaveBeenCalledTimes(1);
  });

  it('returns empty array when on accounts returned from polkadot', async () => {
    mockWeb3Accounts.mockImplementation(() => []);
    const accounts: Account[] = await getAccounts();

    expect(accounts).toEqual([]);
    expect(mockWeb3Accounts).toHaveBeenCalledTimes(1);
    expect(mockWeb3Enable).toHaveBeenCalledTimes(1);
  });
});
