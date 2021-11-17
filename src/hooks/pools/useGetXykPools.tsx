import { useCallback } from 'react';
import { XykPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'

export type PoolAssets = string[];
export const poolAssetsDataType = '(u32, u32)';

export const useGetXykPools = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    return useCallback(async () => {
        if (!apiInstance || loading) return [];

        return (await apiInstance.query.xyk.poolAssets.entries())
            .map(pool => {
                console.log('pool', pool);
                const id = (pool[0].toHuman() as string[])[0];
                const poolAssets = apiInstance.createType(
                    poolAssetsDataType,
                    pool[1]
                ).toHuman() as PoolAssets;

                return {
                    id,
                    assetAId: poolAssets[0],
                    assetBId: poolAssets[1],
                } as XykPool
            }) || []
    }, [
        apiInstance,
        loading
    ])
}