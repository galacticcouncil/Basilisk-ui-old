import { AccountId, AssetId } from '@open-web3/orml-types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { useCallback } from 'react';
import { LbpPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import type { Codec } from '@polkadot/types/types';
import { mapToPoolId } from './useGetXykPools';

export type AssetPair = string[];
export interface PoolData {
    assets: AssetPair
}

export const mapToPool = (apiInstance: ApiPromise) => ([id, codec]: [string, Codec]) => {
    const poolData = codec.toHuman() as unknown as PoolData;
    
    if (!poolData) return;

    return {
        id,
        assetAId: poolData.assets[0],
        assetBId: poolData.assets[1],
    } as LbpPool
}

export const useGetLbpPools = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    return useCallback(async () => {
        if (!apiInstance || loading) return [];
        
        return (await apiInstance.query.lbp.poolData.entries())
            .map(mapToPoolId) 
            .map(mapToPool(apiInstance)) || [];
    }, [
        apiInstance,
        loading,
    ])
}