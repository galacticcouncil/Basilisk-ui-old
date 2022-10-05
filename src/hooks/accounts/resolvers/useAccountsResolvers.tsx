import { useActiveAccountQueryResolver } from './query/activeAccount'
import { useAccountsQueryResolver } from './query/accounts'
import { useSetActiveAccountMutationResolver } from './mutation/setActiveAccount'

// Used to resolve queries for the `Accounts` (or `activeAccount`) entity.
export const useAccountsResolvers = () => {
  const getAccountsQueryResolver = useAccountsQueryResolver()
  const getActiveAccountQueryResolver = useActiveAccountQueryResolver()
  const setActiveAccountMutationResolver = useSetActiveAccountMutationResolver()

  return {
    Query: {
      ...getAccountsQueryResolver,
      ...getActiveAccountQueryResolver
    },
    Mutation: {
      ...setActiveAccountMutationResolver
    }
  }
}
