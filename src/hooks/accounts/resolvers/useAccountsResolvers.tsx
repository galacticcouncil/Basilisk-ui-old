import { useGetAccountsQueryResolver } from './useGetAccountsQueryResolver';
import { useSelectedAccountQueryResolver } from './query/selectedAccount';

/**
 * Used to resolve queries for the `Accounts` (or `selectedAccount`) entity.
 */
export const useAccountsResolvers = () => {
  const getAccountsQueryResolver = useGetAccountsQueryResolver();
  const getSelectedAccountQueryResolver = useSelectedAccountQueryResolver();

  return {
    Query: {
      ...getAccountsQueryResolver,
      ...getSelectedAccountQueryResolver,
    },
  };
};
