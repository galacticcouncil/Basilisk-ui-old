import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { find } from 'lodash'
import { useMemo } from 'react'
import { Account } from '../../../../generated/graphql'
import { withErrorHandler } from '../../../apollo/withErrorHandler'
import {
  Account as PersistedAccount,
  usePersistActiveAccount
} from '../../lib/usePersistActiveAccount'
import { GET_ACCOUNTS } from '../../queries/useGetAccountsQuery'
import { withTypename } from '../../types'

// TODO: turn the active account into a cache ref to Account
export const activeAccountQueryResolverFactory =
  (persistedActiveAccount?: PersistedAccount) =>
  /**
   * Based on the check of persisted active account, this function
   * triggers get all accounts query and performs search on those based
   * on the persisted account id
   *
   * @param _obj
   * @param _args
   * @param client apollo client instance
   * @returns Active account
   */
  async (
    _obj: any,
    _args: any,
    { client }: { client: ApolloClient<NormalizedCacheObject> }
  ): Promise<Partial<Account> | null> => {
    if (persistedActiveAccount?.id) {
      const { data: accountsData } = await client.query({
        query: GET_ACCOUNTS,
        notifyOnNetworkStatusChange: true
      })
      const activeAccount = find(accountsData?.accounts, {
        id: persistedActiveAccount?.id
      })

      return activeAccount ? withTypename(activeAccount) : null
    } else {
      return null
    }
  }

/**
 * For standardization purposes, we expose the resolver as a hook.
 * Since many more complex resolvers require contextual dependency injection,
 * and thus need to apply the useContext hook.
 */
export const useActiveAccountQueryResolver = () => {
  const { persistedActiveAccount } = usePersistActiveAccount()

  return {
    activeAccount: withErrorHandler(
      useMemo(
        () => activeAccountQueryResolverFactory(persistedActiveAccount),
        [persistedActiveAccount]
      ),
      'activeAccount'
    )
  }
}
