import { AccountId, AssetId } from '@open-web3/orml-types/interfaces';
import { ApiPromise } from '@polkadot/api';
import { useCallback } from 'react';
import { LbpPool } from '../../generated/graphql';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs';
import type { Codec } from '@polkadot/types/types';
import { mapToPoolId } from './useGetXykPools';
export interface AssetPair {
    asset_in: string,
    asset_out: string
}

export interface PoolData {
    assets: AssetPair
}

export const poolDataType = 'Pool';

export const mapToPool = (apiInstance: ApiPromise) => ([id, codec]: [string, Codec]) => {
    const poolData = apiInstance.createType(
        poolDataType,
        codec
    ).toHuman() as unknown as PoolData;

    return {
        id,
        assetAId: poolData.assets.asset_in,
        assetBId: poolData.assets.asset_out,
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