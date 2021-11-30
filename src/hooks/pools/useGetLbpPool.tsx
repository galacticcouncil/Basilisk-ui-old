import { ApolloClient } from '@apollo/client';
import { ApiPromise } from '@polkadot/api';
import { useCallback } from 'react';
import { HydraDxMath, useMathContext } from '../math/useMath';
import { usePolkadotJsContext } from '../polkadotJs/usePolkadotJs'
import { mapToPool } from './useGetLbpPools';

export const getLbpPool = async (
    math: HydraDxMath,
    client: ApolloClient<object>,
    apiInstance: ApiPromise,
    poolId: string,
) => {
    return mapToPool(math, client)([
        poolId,
        await apiInstance.query.lbp.poolData(poolId)
    ])
}

export const useGetLbpPool = () => {
    const { apiInstance, loading } = usePolkadotJsContext();
    const { math } = useMathContext();

    return useCallback(async (
        client: ApolloClient<object>, 
        poolId?: string
    ) => {
        if (!apiInstance || loading || !poolId || !math) return;
        return getLbpPool(math, client, apiInstance, poolId);
    }, [apiInstance, loading, math])
}