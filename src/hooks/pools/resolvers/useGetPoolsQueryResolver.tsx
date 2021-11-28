import { ApiPromise } from '@polkadot/api';
import { Codec } from '@polkadot/types/types';
import { isArray, isObject } from 'lodash';
import { useCallback } from 'react';
import { PoolType } from '../../../components/Chart/shared';
import { LbpPool, XykPool } from '../../../generated/graphql';
import { useResolverToRef } from '../../accounts/resolvers/useAccountsMutationResolvers';
import { __typename } from '../../accounts/resolvers/useGetAccountsQueryResolver';
import { usePolkadotJsContext } from '../../polkadotJs/usePolkadotJs';
import { useGetLbpPool } from '../useGetLbpPool';
import { useGetLbpPools } from '../useGetLbpPools';
import { useGetXykPool } from '../useGetXykPool';
import { useGetXykPools } from '../useGetXykPools';

export interface PoolQueryResolverArgs {
    poolId?: string,
    assetIds?: string[],
    poolType?: PoolType
}
// Filter those out, until the following issue is implemented
// https://github.com/galacticcouncil/Basilisk-node/issues/248
export const defaultLbpPoolId = 'bXnAY36Vvd3HdWTX5v1Cgej2tYFsq1UpzShWyAQAr5HQ9FaJx';
export const defaultXykPoolId = 'bXnAY36Vvd3HdWTX5v1Cgej2tYFsq1UpzShWyAQAr5HQ9FaJx';

export interface PoolIds {
    lbpPoolId?: string,
    xykPoolId?: string
}

export const getPoolIdsByAssetIds = async (apiInstance: ApiPromise, assetIds: string[]) => {
    let lbpPoolId: string | undefined = (await (apiInstance.rpc as any).lbp.getPoolAccount(
        assetIds[0], assetIds[1]
    )).toHuman();
    
    let xykPoolId: string | undefined = (await (apiInstance.rpc as any).xyk.getPoolAccount(
        assetIds[0], assetIds[1]
    )).toHuman();

    return {
        lbpPoolId,
        xykPoolId
    }
}

export const useGetPoolsQueryResolver = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const getLbpPools = useGetLbpPools();
    const getXykPools = useGetXykPools();
    const getXykPool = useGetXykPool();
    const getLbpPool = useGetLbpPool();

    return useResolverToRef(
        useCallback(async (
            _obj,
            args?: PoolQueryResolverArgs,
        ) => {
            if (!apiInstance || loading) return;

            // use the provided poolId
            let poolId = args?.poolId;
            let poolIds: PoolIds = {
                lbpPoolId: poolId,
                xykPoolId: poolId
            };

            // if we're querying by assetIds, find the poolIds via RPC
            if (args?.assetIds) {
                poolIds = await getPoolIdsByAssetIds(apiInstance, args.assetIds);
            }

            // if the poolId is specified, try resolving with a single pool
            if (poolIds.xykPoolId || poolIds.lbpPoolId) {
                console.log('fetching pools');
                let lbpPool = await getLbpPool(poolIds.lbpPoolId);
                let xykPool = await getXykPool(poolIds.xykPoolId);
                
                console.log('pools', lbpPool);

                // if the assets are matching, its a default value which means the pool was not found
                if (xykPool?.assetAId === xykPool?.assetBId) xykPool = undefined;
                if (lbpPool?.assetAId === lbpPool?.assetBId) lbpPool = undefined;

                // TODO: which pool should have priority if both types exist for the same assets?
                const pool = xykPool || lbpPool;
        
                return pool && ({
                    ...pool,
                    __typename: xykPool 
                        ? 'XYKPool' as XykPool['__typename']
                        : lbpPool
                            ? 'LBPPool' as LbpPool['__typename']
                            : undefined
                })
            }

            // if no extra args were provided, get all the pools
            const [lbpPools, xykPools] = await Promise.all([
                getLbpPools(),
                getXykPools()
            ]);
            
            return ([] as (LbpPool | XykPool)[])
                .concat(
                    lbpPools
                        ?.map(pool => ({
                            ...pool,
                            __typename: 'LBPPool'
                        }) as LbpPool)
                )
                .concat(
                    xykPools
                        ?.map(pool => ({
                            ...pool,
                            __typename: 'XYKPool'
                        }) as XykPool)
                )

        }, [getLbpPools]),
        'pools'
    )
}