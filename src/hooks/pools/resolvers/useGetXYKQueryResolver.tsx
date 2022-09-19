import { ApolloClient } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import log from 'loglevel';
import { useCallback } from 'react';
import { PoolType } from '../../../components/Chart/shared';
import { LbpPool, XykPool } from '../../../generated/graphql';
import { withErrorHandler } from '../../apollo/withErrorHandler';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs';
import { useGetLbpPool } from '../useGetLbpPool';
import { useGetLbpPools } from '../useGetLbpPools';
import { useGetXykPool } from '../useGetXykPool';
import { useGetXykPools } from '../useGetXykPools';

export interface PoolQueryResolverArgs {
  poolId?: string;
  assetIds?: string[];
  poolType?: PoolType;
}

export interface PoolIds {
  lbpPoolId?: string;
  xykPoolId?: string;
}

export const getPoolIdsByAssetIds = async (
  apiInstance: ApiPromise,
  assetIds: string[]
) => {
  let lbpPoolId: string | undefined = (
    await (apiInstance.rpc as any).lbp.getPoolAccount(assetIds[0], assetIds[1])
  ).toHuman();

  let xykPoolId: string | undefined = (
    await (apiInstance.rpc as any).xyk.getPoolAccount(assetIds[0], assetIds[1])
  ).toHuman();

  return {
    lbpPoolId,
    xykPoolId,
  };
};

export const useGetPoolsQueryResolver = () => {
  const { apiInstance, loading } = usePolkadotJsContext();
  const getLbpPools = useGetLbpPools();
  const getXykPools = useGetXykPools();
  const getXykPool = useGetXykPool();
  const getLbpPool = useGetLbpPool();

  return withErrorHandler(
    useCallback(
      async (
        _obj,
        args?: PoolQueryResolverArgs,
        context?: { client: ApolloClient<object> }
      ) => {
        if (!apiInstance || loading || !context?.client) return;
        log.debug('useGetPoolsQueryResolver', 'fetching pools', args);

        // use the provided poolId
        let poolId = args?.poolId;
        let poolIds: PoolIds = {
          lbpPoolId: poolId,
          xykPoolId: poolId,
        };

        // if we're querying by assetIds, find the poolIds via RPC
        if (args?.assetIds) {
          poolIds = await getPoolIdsByAssetIds(apiInstance, args.assetIds);
          log.debug(
            'useGetPoolsQueryResolver',
            'found poolIDs',
            poolIds,
            apiInstance
          );
        }

        // if the poolId is specified, try resolving with a single pool
        if (poolIds.xykPoolId || poolIds.lbpPoolId) {
          let lbpPool = await getLbpPool(context.client, poolIds.lbpPoolId);
          let xykPool = await getXykPool(poolIds.xykPoolId);

          log.debug(
            'useGetPoolsQueryResolver',
            'found pools by poolIDs',
            lbpPool,
            xykPool
          );

          // if the assets are matching, its a default value which means the pool was not found
          if (xykPool?.assetInId === xykPool?.assetOutId) xykPool = undefined;
          if (lbpPool?.assetInId === lbpPool?.assetOutId) lbpPool = undefined;

          log.debug(
            'useGetPoolsQueryResolver',
            'eliminated default value pools',
            lbpPool,
            xykPool
          );

          // TODO: which pool should have priority if both types exist for the same assets?
          const pool = xykPool || lbpPool;

          log.debug(
            'useGetPoolsQueryResolver',
            'returning a single pool',
            pool
          );

          return (
            pool && {
              ...pool,
              __typename: xykPool
                ? ('XYKPool' as XykPool['__typename'])
                : lbpPool
                ? ('LBPPool' as LbpPool['__typename'])
                : undefined,
            }
          );
        }

        // if no extra args were provided, get all the pools
        const [lbpPools, xykPools] = await Promise.all([
          [] as any[],
          getXykPools(),
        ]);

        log.debug('useGetPoolsQueryResolver', 'returning multiple pools', [
          lbpPools,
          xykPools,
        ]);

        return ([] as (LbpPool | XykPool)[])
          .concat(
            lbpPools?.map(
              (pool) =>
                ({
                  ...pool,
                  __typename: 'LBPPool',
                } as LbpPool)
            )
          )
          .concat(
            xykPools?.map(
              (pool) =>
                ({
                  ...pool,
                  __typename: 'XYKPool',
                } as XykPool)
            )
          );
      },
      [apiInstance, getLbpPool, getLbpPools, getXykPool, getXykPools, loading]
    ),
    'pools'
  );
};
