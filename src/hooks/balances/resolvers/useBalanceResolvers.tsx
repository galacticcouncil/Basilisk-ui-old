import { useBalanceQueryResolvers } from './query/balances';

export const useBalanceResolvers = () => {
  return {
    Query: {
      ...useBalanceQueryResolvers(),
    },
  };
};
