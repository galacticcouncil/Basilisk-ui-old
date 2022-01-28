import { useSelectedAccountQueryResolver } from './query/selectedAccount';

/**
 * Used to resolve queries for the `Account` (or `accounts`) entity.
 */
export const useSelectedAccountQueryResolvers = () => {
  const getSelectedAccountQueryResolver = useSelectedAccountQueryResolver();

  return {
    Query: {
      selectedAccount: getSelectedAccountQueryResolver,
    },
    // /**
    //  * Additional sub-resolvers for the `Account` entity,
    //  * resolving e.g. the `balances` or `vestingSchedules` fields.
    //  */
    // SelectedAccount: {
    //   ...useBalanceQueryResolvers(),
    // },
  };
};
