import { Account } from '../../../generated/graphql'
import { getAccounts } from './getAccounts'

const mockWeb3Accounts = jest.fn()
const mockWeb3Enable = jest.fn(async () => {
  return [
    {
      name: 'polkadot-js',
      version: '0.42.2',
      accounts: {},
      metadata: {},
      provider: {},
      signer: {}
    }
  ]
})

jest.mock('@polkadot/extension-dapp', () => ({
  web3Accounts: () => mockWeb3Accounts(),
  web3Enable: () => mockWeb3Enable()
}))

describe('getAccounts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('account(s) are present in the wallet', () => {
    describe('one account in the wallet', () => {
      beforeEach(() => {
        mockWeb3Accounts.mockImplementation(() => [
          {
            address: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9',
            meta: {
              name: 'name',
              source: 'source'
            }
          }
        ])
      })

      it('can retrieve one account', async () => {
        const accounts: Partial<Account>[] = await getAccounts()

        expect(accounts).toEqual([
          {
            name: 'name',
            source: 'source',
            balances: [],
            id: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9'
          }
        ])
        expect(mockWeb3Accounts).toHaveBeenCalledTimes(1)
        expect(mockWeb3Enable).toHaveBeenCalledTimes(1)
      })
    })

    describe('multiple accounts in the wallet', () => {
      beforeEach(() => {
        mockWeb3Accounts.mockImplementation(() => [
          {
            address: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9',
            meta: {
              name: 'name',
              source: 'source'
            }
          },
          {
            address: 'bXikYFVEuifjmPT3j41zwqwrGAJTzMv69weEqrvAotP9VfHxS',
            meta: {
              name: 'name2',
              source: 'source'
            }
          }
        ])
      })

      it('can retrieve multiple accounts', async () => {
        const accounts: Partial<Account>[] = await getAccounts()

        expect(accounts).toEqual([
          {
            name: 'name',
            source: 'source',
            balances: [],
            id: 'bXiUDcztNS6ZAgjy5zUzMHoUMbsz3hQ2Xh1sxyhvxKfoTHvK9'
          },
          {
            name: 'name2',
            source: 'source',
            balances: [],
            id: 'bXikYFVEuifjmPT3j41zwqwrGAJTzMv69weEqrvAotP9VfHxS'
          }
        ])
        expect(mockWeb3Accounts).toHaveBeenCalledTimes(1)
        expect(mockWeb3Enable).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('accounts are not present in the wallet', () => {
    beforeEach(() => {
      mockWeb3Accounts.mockImplementation(() => [])
    })

    it('returns an empty array when no accounts are returned from wallet', async () => {
      const accounts: Partial<Account>[] = await getAccounts()

      expect(accounts).toEqual([])
      expect(mockWeb3Accounts).toHaveBeenCalledTimes(1)
      expect(mockWeb3Enable).toHaveBeenCalledTimes(1)
    })
  })
})
