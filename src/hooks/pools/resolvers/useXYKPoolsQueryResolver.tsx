import { useBalanceQueryResolvers } from '../../balances/resolvers/query/balances';
import { useGetPoolsQueryResolver } from './useGetXYKQueryResolver';

export const useXYKPoolsQueryResolver = () => {
  const getPoolsQueryResolver = useGetPoolsQueryResolver();
  const poolFieldsQueryResolvers = {
    ...useBalanceQueryResolvers(),
  };

  return {
    Query: {
      pools: getPoolsQueryResolver,
    },
    XYKPool: poolFieldsQueryResolvers,
  };
};
