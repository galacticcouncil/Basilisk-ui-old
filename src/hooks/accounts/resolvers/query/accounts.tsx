import { useCallback } from 'react'
import { withErrorHandler } from '../../../apollo/withErrorHandler'
import { getAccounts } from '../../lib/getAccounts'
import { withTypename } from '../../types'

export const useAccountsQueryResolver = () => {
  return {
    accounts: withErrorHandler(
      useCallback(async (_obj) => {
        const accounts = await getAccounts()

        // if no results were found, return undefined/null
        // this is useful when un-setting the active account
        if (!accounts) {
          return null
        }

        return accounts.map((account) => withTypename(account))
      }, []),
      'accounts'
    )
  }
}
