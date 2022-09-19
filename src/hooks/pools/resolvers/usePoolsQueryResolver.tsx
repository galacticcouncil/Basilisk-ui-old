import { PoolType } from '../../../components/Chart/shared';
import { useBalanceQueryResolvers } from '../../balances/resolvers/query/balances';
import { useGetPoolsQueryResolver } from './useGetPoolsQueryResolver';

export const usePoolsQueryResolver = (poolType?: PoolType) => {
  const getPoolsQueryResolver = useGetPoolsQueryResolver();
  const poolFieldsQueryResolvers = {
    ...useBalanceQueryResolvers(),
  };

  return {
    Query: {
      pools: getPoolsQueryResolver,
    },
    XYKPool:
      poolType === undefined || poolType === PoolType.XYK
        ? poolFieldsQueryResolvers
        : null,
    LBPPool:
      poolType === undefined || poolType === PoolType.LBP
        ? poolFieldsQueryResolvers
        : null,
  };
};
