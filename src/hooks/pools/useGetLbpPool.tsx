import { useCallback } from 'react';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { mapToPool } from './useGetLbpPools';

export const useGetLbpPool = () => {
    const { apiInstance, loading } = usePolkadotJsContext();

    return useCallback(async (poolId?: string) => {
        if (!apiInstance || loading || !poolId) return;

        return mapToPool(apiInstance)([
            poolId,
            await apiInstance.query.lbp.poolData(poolId)
        ])
    }, [
        apiInstance,
        loading
    ])
}