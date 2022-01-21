import { useBalanceQueryResolvers } from '../../balances/useBalanceQueryResolvers';
import { useGetAccountsQueryResolver } from './useGetAccountsQueryResolver';
import { useSelectedAccountQueryResolver } from './query/selectedAccount';
import { useVestingScheduleQueryResolvers } from '../../vesting/useVestingScheduleQueryResolvers';

/**
 * Used to resolve queries for the `Account` (or `accounts`) entity.
 */
export const useAccountsResolvers = () => {
  const getAccountsQueryResolver = useGetAccountsQueryResolver();
  const getSelectedAccountQueryResolver = useSelectedAccountQueryResolver();

  return {
    Query: {
      ...getAccountsQueryResolver,
      ...getSelectedAccountQueryResolver,
    },
    Accounts: {
      ...useBalanceQueryResolvers(),
    },
    SelectedAccount: {
      ...useBalanceQueryResolvers(),
      ...useVestingScheduleQueryResolvers(),
    },
  };
};
