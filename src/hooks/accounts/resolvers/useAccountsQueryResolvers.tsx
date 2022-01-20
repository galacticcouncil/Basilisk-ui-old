import { useBalanceQueryResolvers } from '../../balances/useBalanceQueryResolvers';
import { useGetAccountsQueryResolver } from './useGetAccountsQueryResolver';
import { useSelectedAccountQueryResolver } from './query/selectedAccount';
import { useVestingScheduleQueryResolvers } from '../../vesting/useVestingScheduleQueryResolvers';

/**
 * Used to resolve queries for the `Account` (or `accounts`) entity.
 */
export const useAccountsQueryResolvers = () => {
  const getAccountsQueryResolver = useGetAccountsQueryResolver();
  const getSelectedAccountQueryResolver = useSelectedAccountQueryResolver();

  return {
    Query: {
      accounts: getAccountsQueryResolver,
      selectedAccount: getSelectedAccountQueryResolver,
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
