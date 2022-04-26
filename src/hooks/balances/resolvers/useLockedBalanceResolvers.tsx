import { useLockedBalanceQueryResolvers } from './query/lockedBalances';

export const useLockedBalanceResolvers = () => {
  return {
    Query: {
      ...useLockedBalanceQueryResolvers(),
    },
  };
};
