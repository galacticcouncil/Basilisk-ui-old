import { Account, Balance } from '../../generated/graphql'

/**
 * Get BSX balance from Account
 *
 * TODO: tests
 * @param account
 */
const getBsxBalance = (account: Account) => {
  const balance: Balance = {
    assetId: '0',
    balance: '0'
  }

  const basiliskBalances = account?.balances.filter(
    (balance) => balance.assetId === '0'
  )

  if (basiliskBalances.length) {
    return basiliskBalances[0]
  } else return balance
}

export default getBsxBalance
