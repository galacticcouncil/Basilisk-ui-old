import { useBalanceQueryResolvers } from '../../balances/resolvers/query/balances';
import { useGetPoolsQueryResolver } from './useGetLBPPoolsQueryResolver';

export const useLBPPoolsQueryResolver = () => {
  const getPoolsQueryResolver = useGetPoolsQueryResolver();
  const poolFieldsQueryResolvers = {
    ...useBalanceQueryResolvers(),
  };

  return {
    Query: {
      pools: getPoolsQueryResolver,
    },
    LBPPool: poolFieldsQueryResolvers,
  };
};
