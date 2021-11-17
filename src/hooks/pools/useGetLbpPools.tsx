import { AccountId, AssetId } from '@open-web3/orml-types/interfaces';
import { useCallback } from 'react';
import { LbpPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';

export interface AssetPair {
    asset_in: AssetId,
    asset_out: AssetId
}

export interface PoolData {
    assets: AssetPair
}

export const poolDataType = 'Pool';

export const useGetLbpPools = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    return useCallback(async () => {
        if (!apiInstance || loading) return [];
        
        return (await apiInstance.query.lbp.poolData.entries())
            .map(pool => {
                // TODO: this can't be right, figure out how to cast this in a better way
                const id = (pool[0].toHuman() as string[])[0];
                const poolData = apiInstance.createType(
                    poolDataType,
                    pool[1]
                ) as unknown as PoolData;

                return {
                    id,
                    assetAId: poolData.assets.asset_in.toHuman(),
                    assetBId: poolData.assets.asset_out.toHuman(),
                } as LbpPool
            }) || [];
    }, [
        apiInstance,
        loading,
    ])
}