import { useActiveAccountQueryResolver } from './query/activeAccount';
import { useGetAccountsQueryResolver } from './query/getAccounts';

/**
 * Used to resolve queries for the `Accounts` (or `selectedAccount`) entity.
 */
export const useAccountsResolvers = () => {
  const getAccountsQueryResolver = useGetAccountsQueryResolver();
  const getActiveAccountQueryResolver = useActiveAccountQueryResolver();

  return {
    Query: {
      ...getAccountsQueryResolver,
      ...getActiveAccountQueryResolver,
    },
  };
};
