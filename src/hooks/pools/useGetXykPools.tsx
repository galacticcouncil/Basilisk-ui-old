import { useCallback } from 'react';
import { XykPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import type { StorageKey } from '@polkadot/types';
import type { AnyTuple, Codec } from '@polkadot/types/types';
import { ApiPromise } from '@polkadot/api';

export type PoolAssets = string[];
export const poolAssetsDataType = '(u32, u32)';

export const mapToPoolId = ([storageKey, codec]: [StorageKey<AnyTuple>, Codec]): [string, Codec] => {
    const id = (storageKey.toHuman() as string[])[0];
    return [id, codec];
}

export const mapToPool = (apiInstance: ApiPromise) => ([id, codec]: [string, Codec]) => {
    const poolAssets = codec.toHuman() as PoolAssets;

    if (!poolAssets) return;

    return {
        id,
        assetAId: poolAssets[0],
        assetBId: poolAssets[1],
    } as XykPool
}

export const useGetXykPools = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    return useCallback(async (poolId?: string, assetIds?: string[]) => {
        if (!apiInstance || loading) return [];

        if (poolId) {
            return [(await apiInstance.query.xyk.poolAssets(poolId))]
                .map(pool => [poolId, pool] as [string, Codec])
                .map(mapToPool(apiInstance))
        }
    
        return (await apiInstance.query.xyk.poolAssets.entries())
            .map(mapToPoolId)  
            .map(mapToPool(apiInstance)) || []
    }, [
        apiInstance,
        loading
    ])
}