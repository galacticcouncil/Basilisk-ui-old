import { Account } from '../../../generated/graphql';
import { getAccounts } from './getAccounts';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';

const mockedWeb3AccountsResponse = [
  {
    address: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9',
    meta: {
      name: 'name',
      source: 'source',
    },
  },
  {
    address: 'bXikYFVEuifjmPT3j41zwqwrGAJTzMv69weEqrvAotP9VfHxS',
    meta: {
      name: 'name2',
      source: 'source',
    },
  },
];

jest.mock('@polkadot/extension-dapp');
const mockWeb3Accounts = web3Accounts as jest.Mock;
const mockWeb3Enable = web3Enable as jest.Mock;

describe('getAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('account(s) are present in the wallet', () => {
    describe('one account in the wallet', () => {
      beforeEach(() => {
        mockWeb3Accounts.mockImplementationOnce(() => [
          mockedWeb3AccountsResponse[0],
        ]);
      });

      it('can retrieve one account', async () => {
        const accounts: Account[] = await getAccounts();
        const expectedAccount = mockedWeb3AccountsResponse[0];

        expect(accounts).toEqual([
          {
            name: expectedAccount.meta.name,
            source: expectedAccount.meta.source,
            balances: [],
            id: expectedAccount.address,
          },
        ]);
        expect(mockWeb3Accounts).toHaveBeenCalledTimes(1);
        expect(mockWeb3Enable).toHaveBeenCalledTimes(1);
      });
    });

    describe('multiple accounts in the wallet', () => {
      beforeEach(() => {
        mockWeb3Accounts.mockImplementationOnce(
          () => mockedWeb3AccountsResponse
        );
      });

      it('can retrieve multiple accounts', async () => {
        const accounts: Account[] = await getAccounts();

        expect(accounts).toEqual([
          {
            name: mockedWeb3AccountsResponse[0].meta.name,
            source: mockedWeb3AccountsResponse[0].meta.source,
            balances: [],
            id: mockedWeb3AccountsResponse[0].address,
          },
          {
            name: mockedWeb3AccountsResponse[1].meta.name,
            source: mockedWeb3AccountsResponse[1].meta.source,
            balances: [],
            id: mockedWeb3AccountsResponse[1].address,
          },
        ]);
        expect(mockWeb3Accounts).toHaveBeenCalledTimes(1);
        expect(mockWeb3Enable).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('accounts are not present in the wallet', () => {
    beforeEach(() => {
      mockWeb3Accounts.mockImplementationOnce(() => []);
    });

    it('returns an empty array when no accounts are returned from wallet', async () => {
      const accounts: Account[] = await getAccounts();

      expect(accounts).toEqual([]);
      expect(mockWeb3Accounts).toHaveBeenCalledTimes(1);
      expect(mockWeb3Enable).toHaveBeenCalledTimes(1);
    });
  });
});
